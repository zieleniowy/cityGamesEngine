module.exports = {
    players: [],
    admins: [],
    timer: { val: 0, commands: [] },
    env: {
        jwtSalt: 'dasdasda1kf',
        maxInt: 9007199254740992,
        savesDir: `${global.rootDir}/data/saves`,
        autosaveInterval: 900000,

    },
    state: {
        global: {
            gameStarted: false
        },
        money: {
            startsWith: 1000,
        },
        exp: {
            expTable: [50, 90, 145, 220, 350, 530, 800, 1240, 1900, 2850, 3900, 5200, 7500, 11200, 16000, 24000, 35500],
        },
        quests: {
            list: {}
        },
        inventory: {
            items: {}
        }
    },
    i18n: {
        global: {
            $noPrivileges: "Nie posiadasz uprawnień do wykonania danego polecenia.",
            $noUser: "Podany użytkownik nie istnieje",
        },
        money: {
            $moneyNoNumber: "Pieniądze muszą być liczbą.",
        },
        exp: {
            $expNoNumber: "Ilość doświadczenia musi być liczbą.",

        },
        inventory: {
            $itemNotExists: "Dany przedmiot nie istnieje",
            $dontHaveItem: "Nie posiadasz danego przedmiotu",
        },
        quests: {
            $questNotExists: "Dane zadanie nie istnieje",
        },
        lootboxes: {
            $itemNotOpenable: "Tego przedmiotu nie da się otworzyć",
        }
    },
}