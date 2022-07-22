import { defineStore } from 'pinia'
import moment from "moment"

export const useTerminalStore = defineStore({
    id: 'terminal',
    state: () => ({
        header: `<p>Welcome to AnotherLinuxDist 20.04 Web Edition (TS/Vue 3.2.33 Build 114514)</p>
        <ul>
            <li>GitHub: <a href="https://github.com/pmbstyle/trofimov.ca" target="_blank">https://github.com/pmbstyle/trofimov.ca</a></li>
        </ul>
        <p>Last login: ${moment().format('MMMM Do YYYY, h:mm:ss a') } from 127.0.0.1</p>
        <p>Type <code>help</code> to see all available commands.</p>`
    }),
    getters: {
        staticHeader: (state) => state.header
    },
    actions: {
       
    }
})
