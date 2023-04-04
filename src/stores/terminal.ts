import { defineStore } from 'pinia'
import moment from "moment"
export interface File {
    text: string;
    color: string;
    weight: string;
}
export interface History {
    command: string;
    output: string | File[];
    pwd: string;
    show?: boolean;
    isEmpty?: boolean;
}

export const useTerminalStore = defineStore({
    id: 'terminal',
    state: () => ({
        header: `<p>Welcome to AnotherLinuxDist 20.04 Web Edition (TS/Vue 3.2.33 Build 114514)</p>
        <ul>
            <li>GitHub: <a href="https://github.com/pmbstyle/trofimov.ca" target="_blank">https://github.com/pmbstyle/trofimov.ca</a></li>
        </ul>
        <p>Last login: ${moment().format('MMMM Do YYYY, h:mm:ss a') } from 127.0.0.1</p>
        <p>Type <code>help</code> to see all available commands.</p>`,
        currentCommand: "" as string,
        history: [] as History[],
        pwd: "~" as string,
        showHeader: true
    }),
    getters: {
        staticHeader: (state) => state.header,
        historyShown(): History[] {
            return this.history.filter((history) => history.show);
        },
        validHistory(): History[] {
            return this.history.filter((history) => !history.isEmpty);
        }
    },
    actions: {
        endCurrentCommand(output?: string | File[]) {
            if (output === undefined) {
                this.currentCommand = "";
                return;
            }
            let isEmpty = false;
            if (typeof output === "string" && output.trim() === "") isEmpty = true;
            this.history.push({
                command: this.currentCommand,
                output: output,
                pwd: this.pwd,
                show: true,
                isEmpty,
            });
            this.currentCommand = "";
        },
        clearHistory() {
            this.history.map((history) => (history.show = false));
            this.history.push({
                command: this.currentCommand,
                output: "",
                pwd: this.pwd,
                show: false,
                isEmpty: false,
            });
            this.showHeader = false;
        },
    }
})
