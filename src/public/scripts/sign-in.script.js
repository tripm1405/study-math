function togglePasswordVisibility() {
  var passwordInput = document.getElementById('password');
  var toggleIcon = document.getElementById('togglePassword');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.classList.remove('fa-eye');
    toggleIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    toggleIcon.classList.remove('fa-eye-slash');
    toggleIcon.classList.add('fa-eye');
  }
}

function redirectToHome(event) {
  event.preventDefault();
  window.location.href = 'home.html';
  return false;
}

document.addEventListener("DOMContentLoaded", function() {
  // Get references to the navigation links and content sections
  const homeLink = document.getElementById("home-link");
  const khoaHocLink = document.getElementById("khoa-hoc-link");
  const baiHocLink = document.getElementById("bai-hoc-link");
  const accountLink = document.getElementById("account-link");
  const thongKeLink = document.getElementById("thong-ke-link");
  const mainContent = document.getElementById("main-content");
  const khoaHocContent = document.getElementById("khoa-hoc-content");
  const baiHocContent = document.getElementById("bai-hoc-content");
  const accountContent = document.getElementById("account-content");
  const thongKeContent = document.getElementById("thong-ke-content");

  // Function to show the specified content and hide the others
  function showContent(contentToShow) {
    mainContent.style.display = "none";
    khoaHocContent.style.display = "none";
    baiHocContent.style.display = "none";
    accountContent.style.display = "none";
    thongKeContent.style.display = "none";

    if (contentToShow) {
      contentToShow.style.display = "block";
    }
  }

  // Event listeners for the navigation links
  homeLink.addEventListener("click", function(event) {
    event.preventDefault();
    showContent(mainContent);
  });

  khoaHocLink.addEventListener("click", function(event) {
    event.preventDefault();
    showContent(khoaHocContent);
  });

  baiHocLink.addEventListener("click", function(event) {
    event.preventDefault();
    showContent(baiHocContent);
  });

  accountLink.addEventListener("click", function(event) {
    event.preventDefault();
    showContent(accountContent);
  });

  thongKeLink.addEventListener("click", function(event) {
    event.preventDefault();
    showContent(thongKeContent);
    renderStatisticsChart('week'); // Initialize with the default period 'week'
  });

  // Initialize by showing the main content
  showContent(mainContent);
});

// Handling tab switching for "Bài học" section
document.addEventListener("DOMContentLoaded", function() {
  var triggerTabList = [].slice.call(document.querySelectorAll('#myTab button'))
  triggerTabList.forEach(function (triggerEl) {
    var tabTrigger = new bootstrap.Tab(triggerEl)

    triggerEl.addEventListener('click', function (event) {
      event.preventDefault()
      tabTrigger.show()
    })
  });
});

// Adding event listeners to the action buttons (view, edit, delete)
document.querySelectorAll('.view-details').forEach(function(element) {
  element.addEventListener('click', function(event) {
    event.preventDefault();
    // Implement view details functionality here
    alert('View details clicked');
  });
});

document.querySelectorAll('.fa-edit').forEach(function(element) {
  element.addEventListener('click', function(event) {
    event.preventDefault();
    // Implement edit functionality here
    alert('Edit clicked');
  });
});

document.querySelectorAll('.fa-trash-alt').forEach(function(element) {
  element.addEventListener('click', function(event) {
    event.preventDefault();
    // Implement delete functionality here
    alert('Delete clicked');
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const timePeriodDropdown = document.getElementById('timePeriodDropdown');
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  dropdownItems.forEach(item => {
    item.addEventListener('click', function(event) {
      event.preventDefault();
      const period = event.target.getAttribute('data-period');
      renderStatisticsChart(period);
      timePeriodDropdown.textContent = event.target.textContent; // Update the dropdown button text
    });
  });

  // Initialize the chart with default period (week)
  renderStatisticsChart('week');
});

let chart; // Declare chart variable in the global scope

function renderStatisticsChart(period) {
  const ctx = document.getElementById('statisticsChart').getContext('2d');
  let labels, data1, data2;

  switch(period) {
    case 'month':
      labels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
      data1 = [50, 60, 70, 80];
      data2 = [30, 40, 50, 60];
      break;
    case 'year':
      labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
      data1 = [400, 350, 300, 450, 500, 550, 600, 650, 700, 750, 800, 850];
      data2 = [300, 250, 200, 350, 400, 450, 500, 550, 600, 650, 700, 750];
      break;
    case 'week':
    default:
      labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
      data1 = [4, 12, 6, 9, 8, 7, 13];
      data2 = [5, 6, 7, 8, 4, 3, 10];
      break;
  }

  if (chart) {
    chart.destroy(); // Destroy the previous chart instance if it exists
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Tổng số học sinh học',
        data: data1,
        borderColor: 'red',
        fill: false
      }, {
        label: 'Tổng số học sinh truy cập',
        data: data2,
        borderColor: 'blue',
        fill: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
        }
      }
    }
  });
}