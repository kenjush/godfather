var app = new Vue({
    el: '#app',
    data: {
        not_started: true,
        show_role_overlay: false,
        show_role_flag: false,
        current_player: '',
        current_role: '',
        show_id: 0,
        new_player: '',
        new_role: '',
        players: [],
        roles: [],
        //default_roles_input_values: 'گادفادر، ناتو، گروگانگیر، مافیا، کاراگاه، پزشک، نگهبان، تفنگدار، تکاور، شهروند',
        // default_roles_input_values: 'Godfather, Mafia, Doctor, Detective, Armoured, Sniper, Citizen, Silencer, Natasha, Freemason, Terror, Negotiator, Reporter'
        default_roles_input_values: 'Godfather, Matador, Saul Goodman, Doctor Watson, Leon, Citizen Kane, Constantine, Citizen, Citizen, Citizen, Nostradamus',
        default_roles_input: ''
    },
    created: function() {
        this.load();
    },
    watch: {
        players: function() {
            this.save();
        },
        roles: function() {
            this.save();
        },
        default_roles_input: function() {
            this.save();
        }
    },
    computed: {
        default_roles: function() {
            return this.default_roles_input.replaceAll('،', ',').split(',').map(x => x.trim());
        },
        roles_count: function() {
            const list = []
            this.default_roles.map(x => list.push({ name: x, count: 0 }));
            this.roles.map(x => {
                list.map(y => {
                    if (x.name == y.name) {
                        y.count += 1;
                    };
                });
            })
            return list;
        }
    },
    methods: {
        addPlayer: function() {
            if (this.new_player.length > 0) {
                if (this.roles.length > 0) {
                    const new_roles = this.roles.filter(x => this.isEmptyObj(x.player));
                    if (new_roles.length > 0) {
                        const rndIndex = this.rndBetween(0, new_roles.length);
                        const player = { name: this.new_player, role: new_roles[rndIndex] };
                        this.players.push(player);
                        new_roles[rndIndex].player = this.players[this.players.length - 1];
                        this.new_player = '';
                    } else {
                        alert("All roles has been assigned to players.");
                    }
                } else {
                    alert("Roles are empty.");
                }
            } else {
                alert("Player's name is empty.");
            }
        },
        addRole: function() {
            if (this.new_role.length > 0) {
                const new_role = { name: this.new_role, player: {} };
                this.roles.push(new_role);
            } else {
                alert("Please select a role.");
            }
        },
        unhideRole: function() {
            this.show_role_flag = true
        },
        showRoles: function() {
            if(this.players.length == 0){
                alert("Add more players to start the game")
                return
            }
            this.show_role_overlay = true
            this.showPlayer()
        },
        showPlayer: function() {
            this.show_role_flag = false
            if(this.show_id >= this.players.length){
                alert("All players have seen their roles, ready to start the game?")
                this.show_role_overlay = false
                this.show_id = 0
                this.not_started = false
                return
            }
            this.current_player = this.players[this.show_id].name
            this.current_role = this.players[this.show_id].role.name
            this.show_id = this.show_id + 1
            //this.showPlayer()
        },
        finishGame: function() {
            if (confirm("Are your sure you want to finish? All roles will be reset") == false)
                return
            this.not_started = true
            localStorage.removeItem("default_roles_input")
            localStorage.removeItem("players")
            localStorage.removeItem("roles")
            this.load()
        },
        resetAll: function() {
            this.not_started = true
            localStorage.removeItem("default_roles_input")
            localStorage.removeItem("players")
            localStorage.removeItem("roles")
            this.load()
        },
        removeRole: function(index) {
            const player = this.roles[index].player;
            if (!this.isEmptyObj(player)) {
                playerIndex = this.players.findIndex(x => x === player);
                this.players.splice(playerIndex, 1);
            }
            this.roles.splice(index, 1);
        },
        removePlayer: function(index) {
            this.roles.map(x => {
                if (x.player === this.players[index]) {
                    x.player = {};
                };
            });
            this.players.splice(index, 1);
        },
        rndBetween: function(min, max) {
            return Math.floor(Math.random() * max) + min;
        },
        load: function() {
            const default_roles = '[{"name":"Godfather","player":-1},{"name":"Matador","player":-1},{"name":"Saul Goodman","player":-1},{"name":"Doctor Watson","player":-1},{"name":"Leon","player":-1},{"name":"Citizen Kane","player":-1},{"name":"Constantine","player":-1},{"name":"Citizen","player":-1},{"name":"Citizen","player":-1},{"name":"Citizen","player":-1},{"name":"Nostradamus","player":-1}]'
            const json_roles = JSON.parse(localStorage.getItem('roles')) || JSON.parse(default_roles);
            const json_players = JSON.parse(localStorage.getItem('players')) || [];
            const default_roles_input = localStorage.getItem('default_roles_input') || this.default_roles_input_values;
            console.log(default_roles_input);
            json_roles.map(x => x.player = json_players[x.player] || {});
            json_players.map(x => x.role = json_roles[x.role] || {});

            this.roles = json_roles;
            this.players = json_players;
            this.default_roles_input = default_roles_input;
        },
        save: function() {
            const json_roles = [];
            const json_players = [];
            this.roles.map(x => {
                json_roles.push({
                    name: x.name,
                    player: this.players.findIndex(y => y == x.player),
                })
            });
            this.players.map(x => {
                json_players.push({
                    name: x.name,
                    role: this.roles.findIndex(y => y == x.role),
                })
            });
            localStorage.setItem('roles', JSON.stringify(json_roles));
            localStorage.setItem('default_roles_input', this.default_roles_input);
            localStorage.setItem('players', JSON.stringify(json_players));
            localStorage.setItem('not_started', this.not_started)
        },
        isEmptyObj: function(obj) {
            return Object.entries(obj).length === 0;
        }
    },
})
