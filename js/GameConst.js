// GameConst.js

export const GLOBALS = {

    FLOOR_MAX : 42,
    TIME_MAX : 9999,
    ENERGY_MAX : 9999,
    FLIP_ENRGY : 100,
    PLAYER_SPEED_MIN : 2,
    PLAYER_SPEED_MAX : 5,
    FLIP_SPEED_MIN : 1,
    FLIP_SPEED_MAX : 6,
    BARRIER_MAX : 3,
    RING_MAX : 4,
    USB_MAX : 4,
    SCOPE_MAX : 4,
    COLLECTION_MAX : 8,
    MAX_BONUS : 1000,

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
            SPEED : 8,
            FLIP : 9,
            ENERGY : 10,
            BARRIER : 11,
            POINT : 12,
            ST_SPEED : 16,
            ST_FLIP : 24,
            ST_BARRIER : 32,
            PICT_MIN : 40,
            PICT_MAX : 43,
            PICT_ALEF : 40,
            PICT_SAMECH : 41,
            PICT_AYIN : 42,
            PICT_CHET : 43,
            RING : 48,
            ST_RING : 49,
            USB : 56,
            ST_USB : 57,
            SCOPE : 64, 
            ST_SCOPE : 65
        },
    },

    EFFECT : {
        TYPE : {
            EXPLOSION : 0,
            EXTINCTION : 1,
            TEXT : 2
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

};