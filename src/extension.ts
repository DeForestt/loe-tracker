import * as vscode from 'vscode';
import { track } from './LOETracker';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	// check if .git folder exists
	// if not deactivate extension
	// if so, start tracking
	const workSpace = vscode.workspace.workspaceFolders;
    if (!workSpace) {
		console.log('LOE Tracker: No workspace found');
        return;
    }
    const gitPath = workSpace[0].uri.fsPath + '/.git/HEAD';

    if (!fs.existsSync(gitPath)) {
		console.log('LOE Tracker: No git repository found');
        return;
    }

	console.log('Congratulations, your extension "loe-tracker" is now active!');

	let disposable = vscode.commands.registerCommand('loe-tracker.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from LOE Tracker!');
	});

	track(context);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
