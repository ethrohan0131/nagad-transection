
let totalCash = 0;
let totalB2B = 0;

function initDate() {
  const monthNamesBn = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
const toBn = n => n.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
const today = new Date();
const day = toBn(today.getDate());
const month = monthNamesBn[today.getMonth()];
const year = toBn(today.getFullYear());
const formatted = `${day} ${month}, ${year}`;
document.getElementById('date').value = formatted;
document.getElementById('date').type = 'text'; // input type=date → text

  if (localStorage.getItem('dataRows')) {
    document.getElementById('dataTable').innerHTML = localStorage.getItem('dataRows');
    totalCash = parseFloat(localStorage.getItem('totalCash')) || 0;
    totalB2B = parseFloat(localStorage.getItem('totalB2B')) || 0;
    updateTotals();
  }
}

function addEntry() {
  const name = document.getElementById('name').value;
  const date = document.getElementById('date').value;
  const type = document.getElementById('type').value;
  const amount = parseFloat(document.getElementById('amount').value);
  if (!name || !date || isNaN(amount)) {
    alert('Sob field fill up korun');
    return;
  }
  const row = document.getElementById('dataTable').insertRow();
  row.innerHTML = `<td contenteditable="true">${name}</td>
    <td contenteditable="true">${date}</td>
    <td contenteditable="true">${type}</td>
    <td contenteditable="true">${amount}</td>
    <td><button class='action-btn' onclick="deleteRow(this)">Delete</button></td>`;
  if (type === 'Cash') totalCash += amount;
  else if (type === 'B2B') totalB2B += amount;
  updateTotals();
  saveToLocalStorage();
  document.getElementById('amount').value = '';
}

function updateTotals() {
  document.getElementById('totalCash').innerText = totalCash;
  document.getElementById('totalB2B').innerText = totalB2B;
  document.getElementById('totalAll').innerText = totalCash + totalB2B;
}

function deleteRow(btn) {
  const row = btn.closest('tr');
  const amount = parseFloat(row.cells[3].innerText);
  const type = row.cells[2].innerText;
  if (type === 'Cash') totalCash -= amount;
  else if (type === 'B2B') totalB2B -= amount;
  row.remove();
  updateTotals();
  saveToLocalStorage();
}

function clearTable() {
  document.getElementById('dataTable').innerHTML = '';
  totalCash = 0;
  totalB2B = 0;
  updateTotals();
  localStorage.clear();
}

function filterTable() {
  const filter = document.getElementById('search').value.toUpperCase();
  const rows = document.getElementById('dataTable').rows;
  for (let i = 0; i < rows.length; i++) {
    const nameCell = rows[i].cells[0];
    rows[i].style.display = nameCell.innerText.toUpperCase().includes(filter) ? '' : 'none';
  }
}

function printPage() {
  window.print();
}

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Nagad Transaction Table", 10, 10);
  const rows = [...document.getElementById('dataTable').rows].map(row =>
    [...row.cells].slice(0, 4).map(cell => cell.innerText)
  );
  doc.autoTable({ head: [['Name', 'Date', 'Type', 'Amount']], body: rows });
  doc.save("nagad_data.pdf");
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function saveToLocalStorage() {
  localStorage.setItem('dataRows', document.getElementById('dataTable').innerHTML);
  localStorage.setItem('totalCash', totalCash);
  localStorage.setItem('totalB2B', totalB2B);
}
