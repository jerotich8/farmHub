document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    alert('You have been logged out');
    window.location.href = 'signIn.html'; // Redirect to login page
});


document.getElementById('getRecommendation').addEventListener('click', async function () {
    const cropName = document.getElementById('cropName').value.trim();

    if (!cropName) {
        alert('Please enter a crop name.');
        return;
    }

    // Clear previous results
    const resultDiv = document.getElementById('recommendationResult');
    resultDiv.innerHTML = 'Loading...';

    try {
        const response = await fetch('http://localhost:5000/api/recommend-market', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ crop_name: cropName }),
        });

        if (response.ok) {
            const recommendation = await response.json();
            if (recommendation.market_name) {
                resultDiv.innerHTML = `
                    <h4>Recommended Market</h4>
                    <p><strong>Market Name:</strong> ${recommendation.market_name}</p>
                    <p><strong>County:</strong> ${recommendation.county}</p>
                    <p><strong>Wholesale Price:</strong> ${recommendation.wholesale_price}</p>
                    <p><strong>Retail Price:</strong> ${recommendation.retail_price}</p>
                `;
            } else {
                resultDiv.innerHTML = `<p class="text-danger">No market recommendation found for "${cropName}".</p>`;
            }
        } else {
            const error = await response.json();
            resultDiv.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
        }
    } catch (error) {
        console.error('Error fetching recommendation:', error);
        resultDiv.innerHTML = `<p class="text-danger">An error occurred while fetching recommendations.</p>`;
    }
});
