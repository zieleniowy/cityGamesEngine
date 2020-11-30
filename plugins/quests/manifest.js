module.exports = api => {
    api.admin.addPage('/quests', 'quests.quests', 'tab', api.admin.addComponent('QuestsIcon.js', 'Icon'));
    api.admin.addToPage(api.admin.addComponent('QuestCreate.js', 'Create'), '/quests');
    api.admin.addComponent('StatusSelect.js', 'StatusSelect');
    api.admin.i18n({
        noQuests: 'Brak zadań do wyświetlenia',
        create: 'stwórz zadanie',
        questTitle: 'tytuł zadania',
        questMetaTitle: 'tytuł pomocniczy',
        description: 'opis zadania',
        addQuest: 'dodaj zadanie',
        defaultStatus: 'domyślny stan',
        status: 'stan zadania',
        quests: 'zadania',
        completed: 'Ukończone',
        inactive: 'Niekatywne',
        active: 'Aktywne',
        failed: "Zepsute",
        whenVisible: 'Stany, w których widoczne dla gracza'
    });
    api.admin.setState({
        createExtensions: [],
        sanitizeFlow: []
    });
    api.server.setState({
        list: {},
    })
    api.server.addComponent('server.js');
}