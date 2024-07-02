document.getElementById('trade-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const pair = document.getElementById('pair').value;
    const result = document.getElementById('result').value;
    const risked = parseFloat(document.getElementById('risked').value);
    const won = parseFloat(document.getElementById('won').value);
    
    const trade = { pair, result, risked, won };
    
    let trades = JSON.parse(localStorage.getItem('trades')) || [];
    trades.push(trade);
    localStorage.setItem('trades', JSON.stringify(trades));
    
    updateStats();
    document.getElementById('trade-form').reset();
});

document.getElementById('clear-stats').addEventListener('click', function() {
    const confirmation = confirm('Are you sure you want to clear all stats and history?');
    if (confirmation) {
        localStorage.removeItem('trades');
        updateStats();
    }
});

function updateStats() {
    const trades = JSON.parse(localStorage.getItem('trades')) || [];
    
    let totalWins = 0;
    let totalLosses = 0;
    let totalMoney = 0;
    let totalRisked = 0;
    let totalReward = 0;
    const pairStats = {};

    trades.forEach(trade => {
        if (trade.result === 'win') {
            totalWins++;
            totalMoney += trade.won;
            totalReward += trade.won;
        } else {
            totalLosses++;
            totalMoney -= trade.risked;
        }
        totalRisked += trade.risked;

        if (!pairStats[trade.pair]) {
            pairStats[trade.pair] = { wins: 0, losses: 0 };
        }
        if (trade.result === 'win') {
            pairStats[trade.pair].wins++;
        } else {
            pairStats[trade.pair].losses++;
        }
    });
    
    const winLossPercentage = (totalWins / trades.length) * 100 || 0;
    const riskRewardRatio = totalRisked ? totalReward / totalRisked : 0;

    document.getElementById('total-wins').textContent = totalWins;
    document.getElementById('total-losses').textContent = totalLosses;
    document.getElementById('win-loss-percentage').textContent = `${winLossPercentage.toFixed(2)}%`;
    document.getElementById('total-money').textContent = totalMoney.toFixed(2);
    document.getElementById('risk-reward-ratio').textContent = riskRewardRatio.toFixed(2);

    const pairStatsContainer = document.getElementById('pair-stats');
    pairStatsContainer.innerHTML = ''; // Clear existing content
    for (const pair in pairStats) {
        const pairStat = document.createElement('p');
        pairStat.textContent = `${pair}: Wins - ${pairStats[pair].wins}, Losses - ${pairStats[pair].losses}`;
        pairStatsContainer.appendChild(pairStat);
    }
}

// Initialize stats on page load
updateStats();
