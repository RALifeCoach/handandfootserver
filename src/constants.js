const directions = [
    {
        direction: 'North',
        teamIndex: 0,
        playerIndex: 0
    },
    {
        direction: 'East',
        teamIndex: 1,
        playerIndex: 1
    },
    {
        direction: 'South',
        teamIndex: 0,
        playerIndex: 2
    },
    {
        direction: 'West',
        teamIndex: 1,
        playerIndex: 3
    }
];

const suits = [
    'Club', 'Diamond', 'Heart', 'Spade', 'Joker'
];

const sorts = [
    'none', 'melds', 'runs'
];

export { directions, suits, sorts };
