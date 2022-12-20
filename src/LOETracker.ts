import * as vscode from 'vscode';
import { watchGit, getCurrentBranch } from './GitMonitor';

interface BranchData {
    branch: string;
    time: number;
};

export const track = (context : vscode.ExtensionContext) : void => {
    console.log('LOE Tracker: Tracking time on branches');
    const branchData = context.workspaceState.get<BranchData[]>('branchData', []);
    let currentBranch = getCurrentBranch();
    if (!currentBranch) {
        return;
    };

    let currentBranchData = branchData.find((brachData) => brachData.branch === currentBranch);
    
    // If the current branch is not in the array, add it
    if (!currentBranchData) {
        branchData.push({ branch: currentBranch, time: 0 });
    }

    // increment the time every second
    setInterval(() => {
        const currentBranchData = branchData.find((brachData) => brachData.branch === currentBranch);
        if (currentBranchData) {
            currentBranchData.time++;
        };
    }, 1000);

    // Save the 10 seconds
    setInterval(() => {
        context.workspaceState.update('branchData', branchData);
    }, 10000);

    // Watch for changes to the git branch
    watchGit((branch: string) : void => {
        // switch to the new branch
        currentBranch = branch;
        // If the current branch is not in the array, add it
        if (!branchData.find((brachData) => brachData.branch === currentBranch)) {
            branchData.push({ branch: currentBranch, time: 0 });
        }
        console.log(`Loe Tracker: Switched to branch ${currentBranch}`);
    });

    let disposable = vscode.commands.registerCommand('loe-tracker.showLOE', () => {
        const output = vscode.window.createOutputChannel('LOE Tracker');
        output.show();
        output.appendLine('Branches:');
        branchData.forEach((branchData) => {
            output.appendLine(`${branchData.branch.replace('\n', '')}: ${secondsToHms(branchData.time)}`);
        });
    });

    context.subscriptions.push(disposable);
};

function secondsToHms(d : number) {
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
}