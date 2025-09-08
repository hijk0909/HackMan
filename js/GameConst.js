// GameConst.js

export const GLOBALS = {

    VERSION : "0.8.8",
    DATE : "2025.9.6",
    FLOOR_MAX : 60,
    TIME_MAX : 9999,
    ENERGY_MAX : 9999,
    FLIP_ENRGY : 100,
    PLAYER_SPEED_MIN : 2,
    PLAYER_SPEED_MAX : 5,
    FLIP_SPEED_MIN : 1,
    FLIP_SPEED_MAX : 6,
    BARRIER_MAX : 3,
    GLOVE_MAX : 4,
    USB_MAX : 4,
    VISUALIZER_MAX : 4,
    COLLECTION_MAX : 8,
    MAX_BONUS : 1000,
    INIT_LIVES : 2,
    EXTEND_FIRST : 20000,
    EXTEND_EVERY : 50000,

    COLOR: {
        BLACK : 0x000000,
        WHITE : 0xffffff,
        GRAY : 0x808080,
        RED : 0xff0000,
        WALL_NORMAL :  0xddffff,
        WALL_READY :   0xff8000,
        WALL_SHORT :   0x808000,
        WALL_FLIP :    0xff0000,
        PANEL_NORMAL : 0xffffff,
        PANEL_ABOVE :  0xff0000,
        PANEL_BELOW :  0x808080,
        PANEL_READY :  0xff8000,
        PANEL_SHORT :  0x808000,
        FLIP_TINT : 0xe0e0e0
    },

    DIR: {
        UP : 0,
        RIGHT: 1,     
        DOWN : 2,
        LEFT: 3,
        NUM : 4
    },

    DIR_X: [0,1,0,-1],
    DIR_Y: [-1,0,1,0],

    GAME :{
        STATE:{
            FLOOR_START : 0,
            PLAYING : 1,
            FAILED : 2,
            FLOOR_CLEAR : 3
        },
        PERIDO:{
            FLOOR_START : 100,
            FAILED : 100,
            FLOOR_CLEAR : 100
        },
    },

    FIELD: {
        COL : 5,
        ROW : 6,
        WIDTH : 600,
        HEIGHT : 700
    },

    WALL: {
        TYPE: {
            NORTH : 0,
            SOUTH : 1,
            EAST : 2,
            WEST : 3,
            CORNER : 4
        },
        SIZE: {
            THICK : 50,
            LENGTH : 100
        },
    },

    PANEL : {
        WIDTH : 100,
        HEIGHT : 100,
        FENCE : {
            THICK : 20
        },
        STATE : {
            NORMAL : 0,
            READY : 1,
            FLIP_ABOVE : 2,
            FLIP_BELOW : 3
        },
    },

    ENEMY : {
        TRIBE : {
            E1 : 1,
            E2 : 2,
            E3 : 3,
            E4 : 4,
            E5 : 5
        }
    },

    ITEM : {
        SIZE : 48,
        TYPE : {
            NULL : 0,
            LIVE : 1,
            NONE : 2,
            KEY : 3,
            EXIT : 4,
            BOX : 5,
            BOX_OPEN : 6,
            RING : 7,
            SPEED : 8,
            FLIP : 9,
            ENERGY : 10,
            BARRIER : 11,
            POINT : 12,
            INVINCIBLE : 13,
            ST_SPEED : 16,
            ST_FLIP : 24,
            ST_BARRIER : 32,
            PICT_MIN : 40,
            PICT_MAX : 43,
            PICT_ALEF : 40,
            PICT_SAMECH : 41,
            PICT_AYIN : 42,
            PICT_CHET : 43,
            LAUNCHER_MIN : 44,
            LAUNCHER_MAX : 47,
            LAUNCHER_1 : 45,
            LAUNCHER_2 : 46,
            LAUNCHER_3 : 47,
            LAUNCHER_F : 44,
            GLOVE : 48,
            ST_GLOVE : 49,
            GENERATOR_MIN : 53,
            GENERATOR_MAX : 55,
            GENERATOR_1 : 53,
            GENERATOR_2 : 54,
            GENERATOR_3 : 55,
            USB : 56,
            ST_USB : 57,
            TERMINAL_MIN : 61,
            TERMINAL_MAX : 63,
            TERMINAL_1 : 61,
            TERMINAL_2 : 62,
            TERMINAL_3 : 63,
            VISUALIZER : 64, 
            ST_VISUALIZER : 65
        },
    },

    EFFECT : {
        TYPE : {
            EXPLOSION : 0,
            EXTINCTION : 1,
            TEXT : 2,
            LASER : 3
        },
    },

    FLIP_STATE : {
        NONE : 0,
        READY : 1,
        FLIP : 2
    },

    MOVABLE : {
        SIZE : 64,
    },

    RANKING_URL : "https://script.google.com/macros/s/AKfycbziOMlOIzHcnIEYyPy6xmA628EtyJ-YdXcnKU1kEly89fRXZM0WlBsxhYA9fV9E1_op/exec",
    RANKING_DEFAULT : [
        {"name": "HACKMAN ","score": 250000,"floor": 50,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "HACKMAN ","score": 200000,"floor": 40,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "HACKMAN ","score": 150000,"floor": 30,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "HACKMAN ","score": 125000,"floor": 25,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "HACKMAN ","score": 100000,"floor": 20,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "HACKMAN ","score":  75000,"floor": 15,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "HACKMAN ","score":  50000,"floor": 10,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "HACKMAN ","score":  25000,"floor":  5,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "HACKMAN ","score":  15000,"floor":  3,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "HACKMAN ","score":   5000,"floor":  1,"time": "2025-09-04T12:19:22.000Z"}
    ]
};