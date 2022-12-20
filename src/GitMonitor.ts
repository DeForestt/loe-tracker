import * as vscode from 'vscode';
import * as fs from 'fs';

export const getCurrentBranch = (): string | undefined => {
    const workSpace = vscode.workspace.workspaceFolders;
    if (!workSpace) {
        return;
    }
    const gitPath = workSpace[0].uri.fsPath + '/.git/HEAD';

    if (!fs.existsSync(gitPath)) {
        return;
    }

    const gitHead = fs.readFileSync(gitPath);

    return gitHead.toString();
};

export const watchGit = (callback: (branch: string) => void) => {
    const workSpace = vscode.workspace.workspaceFolders;
    if (!workSpace) {
        return;
    }
    const gitPath = workSpace[0].uri.fsPath + '/.git/HEAD';

    if (!fs.existsSync(gitPath)) {
        return;
    }

    fs.watch(gitPath, (eventType, filename) => {
            const branch = getCurrentBranch();
            if (branch) {
                callback(branch);
            }
        }
    );
};