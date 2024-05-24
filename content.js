function addColumns() {
    // Select the table
    const table = document.querySelector('table');

    if (!table) {
        console.error('Table not found!');
        return;
    }

    // Add header cells
    const headerRow = table.querySelector('thead tr');
    const allocationHeader = document.createElement('th');
    allocationHeader.className = 'right sortable';
    allocationHeader.innerHTML = '<span>Allocation</span>';
    allocationHeader.style.width = '125px'; // Increase width by 25px
    headerRow.insertBefore(allocationHeader, headerRow.children[1]);

    const investedAmountHeader = document.createElement('th');
    investedAmountHeader.className = 'right sortable';
    investedAmountHeader.innerHTML = '<span>Invested Amount</span>';
    investedAmountHeader.style.width = '125px'; // Increase width by 25px
    headerRow.insertBefore(investedAmountHeader, headerRow.children[5]); // Changed to 5th index

    // Add data cells
    const rows = table.querySelectorAll('tbody tr');
    let totalInvestedAmount = 0;
    const investedAmounts = [];

    rows.forEach((row) => {
        const qtyCell = row.querySelector('td:nth-child(2)');
        const avgCostCell = row.querySelector('td:nth-child(3) span');

        // Parse quantity
        let qtyText = qtyCell.textContent.replace(/,/g, '').trim();
        let qty = 0;
        const qtyMatches = qtyText.match(/T1:\s*(\d+)/);
        if (qtyMatches) {
            qty += parseFloat(qtyMatches[1]);
            qtyText = qtyText.replace(qtyMatches[0], '').trim();
        }
        qty += parseFloat(qtyText);

        const avgCost = parseFloat(avgCostCell.textContent.replace(/,/g, ''));

        if (isNaN(qty) || isNaN(avgCost)) {
            console.error(`Invalid quantity or average cost: qty=${qty}, avgCost=${avgCost}`);
            return;
        }

        const investedAmount = qty * avgCost;
        totalInvestedAmount += investedAmount;
        investedAmounts.push(investedAmount);

        const investedAmountCell = document.createElement('td');
        investedAmountCell.className = 'right';
        investedAmountCell.textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(investedAmount);
        investedAmountCell.style.width = '125px'; // Increase width by 25px
        row.insertBefore(investedAmountCell, row.children[4]); // Changed to 5th index
    });

    if (totalInvestedAmount === 0) {
        console.error('Total invested amount is zero, which is incorrect.');
        return;
    }

    rows.forEach((row, index) => {
        const allocation = (investedAmounts[index] / totalInvestedAmount) * 100;
        const allocationCell = document.createElement('td');
        allocationCell.className = 'right';
        allocationCell.textContent = allocation.toFixed(2) + '%';
        allocationCell.style.width = '125px'; // Increase width by 25px
        row.insertBefore(allocationCell, row.children[1]);
    });

    // Make the new columns sortable
    const headers = Array.from(table.querySelectorAll('th'));

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const columnIndex = headers.indexOf(header);
            const isAscending = header.classList.contains('asc');
            const direction = isAscending ? 1 : -1;

            headers.forEach(th => th.classList.remove('asc', 'desc'));
            header.classList.toggle('asc', !isAscending);
            header.classList.toggle('desc', isAscending);

            const sortedRows = Array.from(rows).sort((rowA, rowB) => {
                let cellA = rowA.children[columnIndex].textContent.trim();
                let cellB = rowB.children[columnIndex].textContent.trim();
            
                cellA = parseFloat(cellA.replace(/[^\d.-]/g, ''));
                cellB = parseFloat(cellB.replace(/[^\d.-]/g, ''));
            
                return (cellA > cellB ? 1 : -1) * direction;
            });     

            const tbody = table.querySelector('tbody');
            sortedRows.forEach(row => tbody.appendChild(row));
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Trigger a click event on the first header cell to initialize sorting
    const firstHeader = document.querySelector('thead th');
    firstHeader.click();
});

// Wait for the table to be generated dynamically
const observer = new MutationObserver((mutations, obs) => {
    const table = document.querySelector('table');
    if (table) {
        addColumns();
        obs.disconnect();
    }
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});
