const printButton = document.getElementById('print-brief');
if (printButton) { printButton.hidden = false; printButton.addEventListener('click', () => window.print()); }
