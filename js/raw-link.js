/**
 * Generates a RawLink for the Red Team Command Generator. If the user hasn't changed
 * the default generated shell command, the generated URL will contain the original
 * parameters to generate the required command on demand.
 *
 * Otherwise a unique URL is created which inlined the current user provided command.
 */
const RawLink = {
    generate: (rsg) => {
        const commandSelector = rsg.uiElements[rsg.commandType].command;
        const currentCommandElement = document.querySelector(commandSelector);
        const defaultGeneratedCommand = rsg.generateReverseShellCommand();
        const isUserProvidedCommand = currentCommandElement.innerHTML != RawLink.escapeHTML(defaultGeneratedCommand);

        if (isUserProvidedCommand) {
            return RawLink.withCustomValue(currentCommandElement.innerText)

        }
        return RawLink.withDefaultPayload(rsg);
    },

    escapeHTML(html) {
        var element = document.createElement('div');
        element.innerHTML = html;
        return element.innerHTML;
    },

    withDefaultPayload: (rsg) => {
        const name = rsg.selectedValues[rsg.commandType];
        const queryParams = new URLSearchParams();
        // VPS
        queryParams.set('ip', rsg.getIP());
        queryParams.set('port', rsg.getPort());
        queryParams.set('httpPort', rsg.getHttpPort());
        queryParams.set('ldapPort', rsg.getLdapPort());

        // Misc
        queryParams.set('hostname', rsg.getHostname());
        queryParams.set('filename', rsg.getFilename());
        queryParams.set('token', rsg.getToken());
        queryParams.set('dnslog', rsg.getDnslog());
        queryParams.set('command', rsg.getCommand());

        // Target
        queryParams.set('targetIp', rsg.getTargetIP());
        queryParams.set('targetPort', rsg.getTargetPort());
        queryParams.set('downloadPath', rsg.getDownloadPath());
        queryParams.set('downlaodFilename', rsg.getDownloadFilename());

        queryParams.set('shell', rsg.getShell());
        queryParams.set('encoding', rsg.getShell());


        return `/${encodeURIComponent(name)}?${queryParams}`
    },

    withCustomValue: (value) => {
        const queryParams = new URLSearchParams();
        queryParams.set('value', value)
        return `/raw?${queryParams}`
    }
}
