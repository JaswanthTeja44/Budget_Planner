let income = 0;
    let expenses = [];

    const incomeInput = document.getElementById('income');
    const expenseNameInput = document.getElementById('expenseName');
    const expenseAmountInput = document.getElementById('expenseAmount');
    const totalIncomeDisplay = document.getElementById('totalIncome');
    const totalExpensesDisplay = document.getElementById('totalExpenses');
    const balanceDisplay = document.getElementById('balance');
    const expensesList = document.getElementById('expensesList');
    const incomeError = document.getElementById('incomeError');
    const expenseError = document.getElementById('expenseError');

    let pieChart, barChart;

    incomeInput.addEventListener('change', () => {
      const value = parseFloat(incomeInput.value);
      if (value < 0 || isNaN(value)) {
        incomeError.textContent = "Income must be a positive number.";
        return;
      }
      incomeError.textContent = "";
      income = value;
      updateSummary();
      updateCharts();
    });

    function addExpense() {
      const name = expenseNameInput.value.trim();
      const amount = parseFloat(expenseAmountInput.value);

      if (!name || isNaN(amount) || amount <= 0) {
        expenseError.textContent = "Enter valid expense name and amount.";
        return;
      }
      expenseError.textContent = "";
      expenses.push({ name, amount });
      expenseNameInput.value = '';
      expenseAmountInput.value = '';
      updateSummary();
      updateExpensesList();
      updateCharts();
    }

    function updateSummary() {
      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      const balance = income - totalExpenses;
      totalIncomeDisplay.textContent = income.toFixed(2);
      totalExpensesDisplay.textContent = totalExpenses.toFixed(2);
      balanceDisplay.textContent = balance.toFixed(2);
    }

    function updateExpensesList() {
      expensesList.innerHTML = '';
      expenses.forEach((e, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${e.name}</span><span>$${e.amount.toFixed(2)}</span>`;
        expensesList.appendChild(li);
      });
    }

    function updateCharts() {
      const labels = expenses.map(e => e.name);
      const data = expenses.map(e => e.amount);

      if (pieChart) pieChart.destroy();
      if (barChart) barChart.destroy();

      const pieCtx = document.getElementById('pieChart').getContext('2d');
      pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: generateColors(data.length)
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Expense Distribution (Pie Chart)'
            }
          }
        }
      });

      const barCtx = document.getElementById('barChart').getContext('2d');
      barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Expenses ($)',
            data,
            backgroundColor: '#42a5f5'
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Expenses Breakdown (Bar Chart)'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    function generateColors(count) {
      const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#C9CBCF', '#E7E9ED'
      ];
      return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
    }

    function resetAll() {
        // Reset variables
        income = 0;
        expenses = [];
      
        // Clear inputs
        incomeInput.value = '';
        expenseNameInput.value = '';
        expenseAmountInput.value = '';
      
        // Clear error messages
        incomeError.textContent = '';
        expenseError.textContent = '';
      
        // Reset displayed totals
        updateSummary();
      
        // Clear expenses list
        updateExpensesList();
      
        // Destroy existing charts if any
        if (pieChart) pieChart.destroy();
        if (barChart) barChart.destroy();
      }
      