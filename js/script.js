const params = ['ip', 'port', 'httpPort', 'ldapPort',
    'hostname', 'filename', 'token', 'command', 'dnslog',
    'targetIP', 'targetIP', 'targetPort', 'downloadPath', 'downloadFilename']
const params_wrap = params.flatMap(item => {
    return '{' + item + '}';
})

// Element selectors
// VPS
const ipInput = document.querySelector("#ip");
const portInput = document.querySelector("#port");
const httpPortInput = document.querySelector("#httpPort");
const ldapPortInput = document.querySelector("#ldapPort");

// Misc
const hostnameInput = document.querySelector('#hostname');
const filenameInput = document.querySelector('#filename');
const tokenInput = document.querySelector('#token');
const commandInput = document.querySelector('#command');
const dnslogInput = document.querySelector('#dnslog');


// Target
const targetIPInput = document.querySelector("#targetIP");
const targetPortInput = document.querySelector("#targetPort");
const downloadPath = document.querySelector("#downloadPath");
const downloadFilename = document.querySelector("#downloadFilename");

const listenerSelect = document.querySelector("#listener-selection");
const shellSelect = document.querySelector("#shell");

// const autoCopySwitch = document.querySelector("#auto-copy-switch");
const encodingSelect = document.querySelector('#encoding');
const listenerCommand = document.querySelector("#listener-command");
const reverseShellCommand = document.querySelector("#reverse-shell-command");
const bindShellCommand = document.querySelector("#bind-shell-command");
const msfVenomCommand = document.querySelector("#msfvenom-command");

const FilterType = {
    'All': 'all',
    'Windows': 'windows',
    'Linux': 'linux',
    'Mac': 'mac'
};

document.querySelector("#os-options").addEventListener("change", (event) => {
    const selectedOS = event.target.value;
    rsg.setState({
        filter: selectedOS,
    });
});

document.querySelector("#reverse-tab").addEventListener("click", () => {
    rsg.setState({
        commandType: CommandType.ReverseShell,
    });
})

document.querySelector("#bind-tab").addEventListener("click", () => {
    rsg.setState({
        commandType: CommandType.BindShell,
        encoding: "None"
    });
})

document.querySelector("#bind-tab").addEventListener("click", () => {
    document.querySelector("#bind-shell-selection").innerHTML = "";
    rsg.setState({
        commandType: CommandType.BindShell

    });
})

document.querySelector("#msfvenom-tab").addEventListener("click", () => {
    document.querySelector("#msfvenom-selection").innerHTML = "";
    rsg.setState({
        commandType: CommandType.MSFVenom,
        encoding: "None"
    });
})

document.querySelector("#msfconsole-tab").addEventListener("click", () => {
    document.querySelector("#msfconsole-selection").innerHTML = "";
    rsg.setState({
        commandType: CommandType.MSFConsole,
        encoding: "None"
    });
})

document.querySelector("#stowaway-tab").addEventListener("click", () => {
    document.querySelector("#stowaway-selection").innerHTML = "";
    rsg.setState({
        commandType: CommandType.Stowaway,
        encoding: "None"
    });
})

document.querySelector("#jndinjection-tab").addEventListener("click", () => {
    document.querySelector("#jndinjection-selection").innerHTML = "";
    rsg.setState({
        commandType: CommandType.JNDInjection,
        encoding: "None"
    });
})

document.querySelector("#ysoui-tab").addEventListener("click", () => {
    document.querySelector("#ysoui-selection").innerHTML = "";
    rsg.setState({
        commandType: CommandType.Ysoui,
        encoding: "None"
    });
})

document.querySelector("#misc-tab").addEventListener("click", () => {
    document.querySelector("#misc-selection").innerHTML = "";
    rsg.setState({
        commandType: CommandType.Misc,
        encoding: "None"
    });
})

var rawLinkButtons = document.querySelectorAll('.raw-listener');
for (const button of rawLinkButtons) {
    button.addEventListener("click", () => {
        const rawLink = RawLink.generate(rsg);
        window.location = rawLink;
    });
}

const filterCommandData = function (data, {commandType, filter}) {
    return data.filter(item => {
        if (!item.meta.includes(commandType)) {
            return false;
        }

        if (!filter) {
            return true;
        }

        if (filter === FilterType.All) {
            return true;
        }

        return item.meta.includes(filter);
    });
}

const query = new URLSearchParams(location.hash.substring(1));

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
const fixedEncodeURIComponent = function (str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
}

const rsg = {
    // VPS
    ip: query.get('ip') || localStorage.getItem('ip') || '10.10.10.10',
    port: query.get('port') || localStorage.getItem('port') || 9001,
    httpPort: query.get('httpPort') || localStorage.getItem('httpPort') || 8101,
    ldapPort: query.get('ldapPort') || localStorage.getItem('ldapPort') || 8201,

    // Misc
    hostname: query.get('hostname') || localStorage.getItem('hostname') || 'localhost',
    filename: query.get('filename') || localStorage.getItem('filename') || 'zabbixAgent',
    token: query.get('token') || localStorage.getItem('token') || 'GoodLuck',
    dnslog: query.get('dnslog') || localStorage.getItem('dnslog') || 'xxx.dnslog.cn',
    command: query.get('command') || localStorage.getItem('command') || 'whoami',

    // Target
    targetIP: query.get('targetIP') || localStorage.getItem('targetIP') || '12.23.34.45',
    targetPort: query.get('targetPort') || localStorage.getItem('targetPort') || 80,
    downloadPath: query.get('downloadPath') || localStorage.getItem('downloadPath') || '/tmp/',
    downloadFilename: query.get('downloadFilename') || localStorage.getItem('downloadFilename') || 'agent',

    // Listener
    payload: query.get('payload') || localStorage.getItem('payload') || 'windows/x64/meterpreter/reverse_tcp',
    shell: query.get('shell') || localStorage.getItem('shell') || rsgData.shells[0],
    listener: query.get('listener') || localStorage.getItem('listener') || rsgData.listenerCommands[0][1],
    encoding: query.get('encoding') || localStorage.getItem('encoding') || 'None',
    selectedValues: {
        [CommandType.ReverseShell]: filterCommandData(rsgData.reverseShellCommands, {commandType: CommandType.ReverseShell})[0].name,
        [CommandType.BindShell]: filterCommandData(rsgData.reverseShellCommands, {commandType: CommandType.BindShell})[0].name,
        [CommandType.MSFVenom]: filterCommandData(rsgData.reverseShellCommands, {commandType: CommandType.MSFVenom})[0].name,
        [CommandType.MSFConsole]: filterCommandData(rsgData.reverseShellCommands, {commandType: CommandType.MSFConsole})[0].name,
        [CommandType.Stowaway]: filterCommandData(rsgData.reverseShellCommands, {commandType: CommandType.Stowaway})[0].name,
        [CommandType.JNDInjection]: filterCommandData(rsgData.reverseShellCommands, {commandType: CommandType.JNDInjection})[0].name,
        [CommandType.Ysoui]: filterCommandData(rsgData.reverseShellCommands, {commandType: CommandType.Ysoui})[0].name,
        [CommandType.Misc]: filterCommandData(rsgData.reverseShellCommands, {commandType: CommandType.Misc})[0].name
    },
    commandType: CommandType.ReverseShell,
    filter: FilterType.All,

    uiElements: {
        [CommandType.ReverseShell]: {
            listSelection: '#reverse-shell-selection',
            command: '#reverse-shell-command'
        },
        [CommandType.BindShell]: {
            listSelection: '#bind-shell-selection',
            command: '#bind-shell-command',
        },
        [CommandType.MSFVenom]: {
            listSelection: '#msfvenom-selection',
            command: '#msfvenom-command'
        },
        [CommandType.MSFConsole]: {
            listSelection: '#msfconsole-selection',
            command: '#msfconsole-command'
        },
        [CommandType.Stowaway]: {
            listSelection: '#stowaway-selection',
            command: '#stowaway-command'
        },
        [CommandType.JNDInjection]: {
            listSelection: '#jndinjection-selection',
            command: '#jndinjection-command'
        },
        [CommandType.Ysoui]: {
            listSelection: '#ysoui-selection',
            command: '#ysoui-command'
        },
        [CommandType.Misc]: {
            listSelection: '#misc-selection',
            command: '#misc-command'
        },
    },

    copyToClipboard: (text) => {
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(text)
            $('#clipboard-toast').toast('show')
        } else if (window?.clipboardData?.setData) {
            window.clipboardData.setData('Text', text);
            $('#clipboard-toast').toast('show')
        } else {
            $('#clipboard-failure-toast').toast('show')
        }
    },

    escapeHTML: (text) => {
        let element = document.createElement('p');
        element.textContent = text;
        return element.innerHTML;
    },

    // VPS
    getIP: () => rsg.ip,
    getPort: () => Number(rsg.port),
    getHttpPort: () => Number(rsg.httpPort),
    getLdapPort: () => Number(rsg.ldapPort),

    // Misc
    getHostname: () => rsg.hostname,
    getFilename: () => rsg.filename,
    getToken: () => rsg.token,
    getDnslog: () => rsg.dnslog,
    getCommand: () => rsg.command,

    // Target
    getTargetIP: () => rsg.targetIP,
    getTargetPort: () => Number(rsg.targetPort),
    getDownloadPath: () => rsg.downloadPath,
    getDownloadFilename: () => rsg.downloadFilename,

    // Listener
    getShell: () => rsg.shell,
    getEncoding: () => rsg.encoding,

    getPayload: () => rsg.payloadSave,

    getSelectedCommandName: () => {
        return rsg.selectedValues[rsg.commandType];
    },

    getReverseShellCommand: () => {
        const reverseShellData = rsgData.reverseShellCommands.find((item) => item.name === rsg.getSelectedCommandName());
        return reverseShellData.command;
    },

    // 保存msfvenom选中的payload值
    getPayload: () => { // 从msfvenom中匹配获取payload
        if (rsg.commandType === 'MSFVenom') {
            let cmd = rsg.getReverseShellCommand();
            // msfvenom -p windows/x64/meterpreter_reverse_tcp ...
            let regex = /\s+-p\s+(?<payload>[a-zA-Z0-9/_]+)/;
            let match = regex.exec(cmd);
            if (match) {
                this.payload = match.groups.payload
            }
        }
        return this.payload

    },

    generateReverseShellCommand: () => {
        let command

        if (rsg.getSelectedCommandName() === 'PowerShell #3 (Base64)') {
            const encoder = (text) => text;
            const payload = rsg.insertParameters(rsgData.specialCommands['PowerShell payload'], encoder)
            command = "powershell -e " + btoa(toBinary(payload))

            function toBinary(string) {
                const codeUnits = new Uint16Array(string.length);
                for (let i = 0; i < codeUnits.length; i++) {
                    codeUnits[i] = string.charCodeAt(i);
                }
                const charCodes = new Uint8Array(codeUnits.buffer);
                let result = '';
                for (let i = 0; i < charCodes.byteLength; i++) {
                    result += String.fromCharCode(charCodes[i]);
                }
                return result;
            }
        } else {
            command = rsg.getReverseShellCommand()
        }

        const encoding = rsg.getEncoding();
        if (encoding === 'Base64') {
            command = rsg.insertParameters(command, (text) => text)
            command = btoa(command)
        } else {
            function encoder(string) {
                let result = string;
                switch (encoding) {
                    case 'encodeURLDouble':
                        result = fixedEncodeURIComponent(result);
                    // fall-through
                    case 'encodeURL':
                        result = fixedEncodeURIComponent(result);
                        break;
                }
                return result;
            }

            command = rsg.escapeHTML(encoder(command));
            // NOTE: Assumes encoder doesn't produce HTML-escaped characters in parameters
            command = rsg.insertParameters(rsg.highlightParameters(command, encoder), encoder);
        }

        return command;
    },

    // 高亮的参数
    highlightParameters: (text, encoder) => {
        const parameters = params_wrap.concat([ // params_wrap包含了所有了{xxx}
            '{base64_command}', '{payload}',
            encodeURI('{shell}'), encodeURI('{base64_command}')
        ], params_wrap.flatMap(item => {    // 包含所有的encodeURI('{xxx}')
            return encodeURI(item)
        }))
        // 遍历
        parameters.forEach((param) => {
            if (encoder) param = encoder(param)
            text = text.replaceAll(param, `<span class="highlighted-parameter">${param}</span>`)
        })
        return text
    },

    init: () => {
        rsg.initListenerSelection()
        rsg.initShells()
    },

    initListenerSelection: () => {
        rsgData.listenerCommands.forEach((listenerData, i) => {
            const type = listenerData[0];
            const command = listenerData[1];

            const option = document.createElement("option");

            option.value = command;
            option.selected = rsg.listener === option.value;
            option.classList.add("listener-option");
            option.innerText = type;

            listenerSelect.appendChild(option);
        })
    },

    initShells: () => {
        rsgData.shells.forEach((shell, i) => {
            const option = document.createElement("option");

            option.selected = rsg.shell === shell;
            option.classList.add("shell-option");
            option.innerText = shell;

            shellSelect.appendChild(option);
        })
    },

    // Updates the rsg state, and forces a re-render
    setState: (newState = {}) => {
        Object.keys(newState).forEach((key) => {
            const value = newState[key];
            rsg[key] = value;
            localStorage.setItem(key, value)
        });
        Object.assign(rsg, newState);

        rsg.update();
    },

    // 替换的地方
    insertParameters: (command, encoder) => {
        return command
            // VPS
            .replaceAll(encoder('{ip}'), encoder(rsg.getIP()))
            .replaceAll(encoder('{port}'), encoder(String(rsg.getPort())))
            .replaceAll(encoder('{httpPort}'), encoder(String(rsg.getHttpPort())))
            .replaceAll(encoder('{ldapPort}'), encoder(String(rsg.getLdapPort())))

            // Misc
            .replaceAll(encoder('{hostname}'), encoder(rsg.getHostname()))
            .replaceAll(encoder('{filename}'), encoder(rsg.getFilename()))
            .replaceAll(encoder('{token}'), encoder(rsg.getToken()))
            .replaceAll(encoder('{dnslog}'), encoder(rsg.getDnslog()))
            .replaceAll(encoder('{command}'), encoder(rsg.getCommand()))
            .replaceAll(encoder('{base64_command}'), btoa(rsg.getCommand()))

            // Target
            .replaceAll(encoder('{targetIP}'), encoder(rsg.getTargetIP()))
            .replaceAll(encoder('{targetPort}'), encoder(String(rsg.getTargetPort())))
            .replaceAll(encoder('{downloadPath}'), encoder(String(rsg.getDownloadPath())))
            .replaceAll(encoder('{downloadFilename}'), encoder(String(rsg.getDownloadFilename())))

            .replaceAll(encoder('{shell}'), encoder(rsg.getShell()))

            .replaceAll(encoder('{payload}'), encoder(rsg.getPayload()))

    },

    // 更新时的操作
    update: () => {
        rsg.updateListenerCommand()
        rsg.updateTabList()
        rsg.updateReverseShellCommand()
        rsg.updateValues()
    },

    updateValues: () => {
        const listenerOptions = listenerSelect.querySelectorAll(".listener-option");
        listenerOptions.forEach((option) => {
            option.selected = rsg.listener === option.value;
        });

        const shellOptions = shellSelect.querySelectorAll(".shell-option");
        shellOptions.forEach((option) => {
            option.selected = rsg.shell === option.value;
        });

        const encodingOptions = encodingSelect.querySelectorAll("option");
        encodingOptions.forEach((option) => {
            option.selected = rsg.encoding === option.value;
        });

        // VPS
        ipInput.value = rsg.ip;
        portInput.value = rsg.port;
        httpPortInput.value = rsg.httpPort;
        ldapPortInput.value = rsg.ldapPort;

        // Misc
        httpPortInput.value = rsg.httpPort;
        hostnameInput.value = rsg.hostname;
        filenameInput.value = rsg.filename;
        tokenInput.value = rsg.token;
        dnslogInput.value = rsg.dnslog;
        commandInput.value = rsg.command;

        // target
        targetIPInput.value = rsg.targetIP;
        targetPortInput.value = rsg.targetPort;
        downloadPath.value = rsg.downloadPath;
        downloadFilename.value = rsg.downloadFilename;
    },

    updateTabList: () => {
        const data = rsgData.reverseShellCommands;
        const filteredItems = filterCommandData(
            data,
            {
                filter: rsg.filter,
                commandType: rsg.commandType
            }
        );

        const documentFragment = document.createDocumentFragment()
        filteredItems.forEach((item, index) => {
            const {
                name,
                command
            } = item;

            const selectionButton = document.createElement("button");

            if (rsg.getSelectedCommandName() === item.name) {
                selectionButton.classList.add("active");
            }

            const clickEvent = () => {
                rsg.selectedValues[rsg.commandType] = name;
                rsg.update();

                // if (document.querySelector('#auto-copy-switch').checked) {
                //     rsg.copyToClipboard(reverseShellCommand.innerText)
                // }
            }

            selectionButton.innerText = name;
            selectionButton.classList.add("list-group-item", "list-group-item-action");
            selectionButton.addEventListener("click", clickEvent);

            documentFragment.appendChild(selectionButton);
        })

        const listSelectionSelector = rsg.uiElements[rsg.commandType].listSelection;
        document.querySelector(listSelectionSelector).replaceChildren(documentFragment)
    },

    updateListenerCommand: () => {
        const privilegeWarning = document.querySelector("#port-privileges-warning");
        let command = listenerSelect.value;
        command = rsg.highlightParameters(command)
        // VPS
        command = command.replace('{ip}', rsg.getIP())
        command = command.replace('{port}', rsg.getPort())
        command = command.replace('{httpPort}', rsg.getHttpPort())
        command = command.replace('{ldapPort}', rsg.getLdapPort())

        // Misc
        command = command.replace('{hostname}', rsg.getHostname())
        command = command.replace('{filename}', rsg.getFilename())
        command = command.replace('{token}', rsg.getToken())
        command = command.replace('{dnslog}', rsg.getDnslog())
        command = command.replace('{command}', rsg.getCommand())

        // Target
        command = command.replace('{targetIP}', rsg.getTargetIP())
        command = command.replace('{targetPort}', rsg.getTargetPort())
        command = command.replace('{downloadPath}', rsg.getDownloadPath())
        command = command.replace('{downloadFilename}', rsg.getDownloadFilename())

        command = command.replace('{payload}', rsg.getPayload())

        if (rsg.getPort() < 1024) { // VPS端口小于1024弹出警告
            // privilegeWarning.style.visibility = "visible";
            command = `<span class="highlighted-warning">sudo</span> ${command}`
        } else {
            privilegeWarning.style.visibility = "hidden";
        }

        listenerCommand.innerHTML = command;
    },

    updateReverseShellSelection: () => {
        document.querySelector(".list-group-item.active")?.classList.remove("active");
        const elements = Array.from(document.querySelectorAll(".list-group-item"));
        const selectedElement = elements.find((item) => item.innerText === rsg.currentCommandName);
        selectedElement?.classList.add("active");
    },

    updateReverseShellCommand: () => {
        const command = rsg.generateReverseShellCommand();
        const commandSelector = rsg.uiElements[rsg.commandType].command;
        document.querySelector(commandSelector).innerHTML = command;
    },

    updateSwitchStates: () => {
        $('#listener-advanced').collapse($('#listener-advanced-switch').prop('checked') ? 'show' :
            'hide')
        $('#revshell-advanced').collapse($('#revshell-advanced-switch').prop('checked') ? 'show' :
            'hide')
    }
}

/*
    * Init
    */
rsg.init();
rsg.update();

/*
    * Event handlers/functions
    */
// VPS
ipInput.addEventListener("input", (e) => {
    rsg.setState({
        ip: e.target.value
    })
});

portInput.addEventListener("input", (e) => {
    rsg.setState({
        port: Number(e.target.value)
    })
});

httpPortInput.addEventListener("input", (e) => {
    rsg.setState({
        httpPort: Number(e.target.value)
    })
});

ldapPortInput.addEventListener("input", (e) => {
    rsg.setState({
        ldapPort: Number(e.target.value)
    })
});

// Target
targetPortInput.addEventListener("input", (e) => {
    rsg.setState({
        targetPort: Number(e.target.value)
    })
});

targetIPInput.addEventListener("input", (e) => {
    rsg.setState({
        targetIp: e.target.value
    })
});

downloadPath.addEventListener("input", (e) => {
    rsg.setState({
        downloadPath: e.target.value
    })
});

downloadFilename.addEventListener("input", (e) => {
    rsg.setState({
        downloadFilename: e.target.value
    })
});

// Misc
hostnameInput.addEventListener("input", (e) => {
    rsg.setState({
        hostname: e.target.value
    })
});

filenameInput.addEventListener("input", (e) => {
    rsg.setState({
        filename: e.target.value
    })
});

tokenInput.addEventListener("input", (e) => {
    rsg.setState({
        token: e.target.value
    })
});

dnslogInput.addEventListener("input", (e) => {
    rsg.setState({
        dnslog: e.target.value
    })
});

commandInput.addEventListener("input", (e) => {
    rsg.setState({
        command: e.target.value
    })
});


listenerSelect.addEventListener("change", (e) => {
    rsg.setState({
        listener: e.target.value
    })
});

shellSelect.addEventListener("change", (e) => {
    rsg.setState({
        shell: e.target.value
    })
});

encodingSelect.addEventListener("change", (e) => {
    rsg.setState({
        encoding: e.target.value
    })
});

/**
 * add button
 */
document.querySelector('#inc-port').addEventListener('click', () => {
    rsg.setState({
        port: rsg.getPort() + 1
    })
})
document.querySelector('#inc-httpPort').addEventListener('click', () => {
    rsg.setState({
        httpPort: rsg.getHttpPort() + 1
    })
})
document.querySelector('#inc-ldapPort').addEventListener('click', () => {
    rsg.setState({
        ldapPort: rsg.getLdapPort() + 1
    })
})
document.querySelector('#inc-targetPort').addEventListener('click', () => {
    rsg.setState({
        targetPort: rsg.getTargetPort() + 1
    })
})


document.querySelector('#listener-advanced-switch').addEventListener('change', rsg.updateSwitchStates);
document.querySelector('#revshell-advanced-switch').addEventListener('change', rsg.updateSwitchStates);

setInterval(rsg.updateSwitchStates, 500) // fix switch changes in rapid succession

document.querySelector('#copy-listener').addEventListener('click', () => {
    rsg.copyToClipboard(listenerCommand.innerText)
})

document.querySelector('#copy-reverse-shell-command').addEventListener('click', () => {
    rsg.copyToClipboard(reverseShellCommand.innerText)
})

document.querySelector('#copy-bind-shell-command').addEventListener('click', () => {
    rsg.copyToClipboard(bindShellCommand.innerText)
})

document.querySelector('#copy-msfvenom-command').addEventListener('click', () => {
    rsg.copyToClipboard(msfVenomCommand.innerText)
})

document.querySelector('#copy-stowaway-command').addEventListener('click', () => {
    rsg.copyToClipboard(stowawayCommands.innerText)
})

document.querySelector('#copy-jndinjection-command').addEventListener('click', () => {
    rsg.copyToClipboard(jndinjectionCommands.innerText)
})

document.querySelector('#copy-ysoui-command').addEventListener('click', () => {
    rsg.copyToClipboard(ysouiCommands.innerText)
})

document.querySelector('#copy-misc-command').addEventListener('click', () => {
    rsg.copyToClipboard(MiscCommands.innerText)
})

var downloadButton = document.querySelectorAll(".download-svg");
for (const Dbutton of downloadButton) {
    Dbutton.addEventListener("click", () => {
        const filename = prompt('Enter a filename', 'payload.sh')
        if (filename === null) return;
        const rawLink = RawLink.generate(rsg);
        axios({
            url: rawLink,
            method: 'GET',
            responseType: 'arraybuffer',
        })
            .then((response) => {
                const url = window.URL.createObjectURL(new File([response.data], filename));
                const downloadElement = document.createElement("a");
                downloadElement.href = url;
                downloadElement.setAttribute('download', filename);
                document.body.appendChild(downloadElement);
                downloadElement.click();
                document.body.removeChild(downloadElement);
            });
    });
}

// autoCopySwitch.addEventListener("change", () => {
//     setLocalStorage(autoCopySwitch, "auto-copy", "checked");
// });

// Popper tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

// TODO: add a random fifo for netcat mkfifo
//let randomId = Math.random().toString(36).substring(2, 4);
