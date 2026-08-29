const express = require('express');
const app = express();
app.use(express.json());

// In-memory or database storage for player currencies (use a database for production)
let playerCurrency = {}; 

// --- 1. DAILY ITEM SHOP CONFIGURATION ---
// You can manually edit this array to choose what items deploy in the shop each day!
const dailyItemShop = [
    {
        id: "cosmetic_skin_01",
        name: "Aura Outfit",
        price: 800,
        type: "outfit"
    },
    {
        id: "cosmetic_pickaxe_02",
        name: "Star Wand",
        price: 500,
        type: "pickaxe"
    },
    {
        id: "cosmetic_emote_03",
        name: "Floss",
        price: 200,
        type: "emote"
    }
];

// Endpoint for the game/launcher to fetch the current Item Shop
app.get('/api/shop/get', (req, res) => {
    res.json({
        success: true,
        shopItems: dailyItemShop
    });
});

// --- 2. REWARD SYSTEM (Kills & Wins) ---
app.post('/api/player/reward', (req, res) => {
    const { accountId, eventType } = req.body; // eventType can be 'kill' or 'win'
    
    if (!playerCurrency[accountId]) {
        playerCurrency[accountId] = { vbucks: 0 };
    }

    if (eventType === 'kill') {
        playerCurrency[accountId].vbucks += 100;
    } else if (eventType === 'win') {
        playerCurrency[accountId].vbucks += 300;
    }

    res.json({
        success: true,
        balance: playerCurrency[accountId].vbucks
    });
});

// Endpoint to check player V-Bucks balance
app.get('/api/player/balance/:accountId', (req, res) => {
    const { accountId } = req.params;
    const balance = playerCurrency[accountId] ? playerCurrency[accountId].vbucks : 0;
    res.json({ success: true, vbucks: balance });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`NovaX backend is running on port ${PORT}`);
});
