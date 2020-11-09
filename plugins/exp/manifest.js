module.exports = api => {
    api.server.addComponent('server.js');
    api.server.setState({
        expTable: [50, 90, 145, 220, 350, 530, 800, 1240, 1900, 2850, 3900, 5200, 7500, 11200, 16000, 24000, 35500]
    });
    api.player.addToPage(api.player.addComponent('PlayerExpBar.js', 'ExpBar'), '/');
    
}