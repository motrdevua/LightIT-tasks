const url = "https://randomuser.me/api/?format=json&results=10";
let output = "";

function generateUser(user, name) {
  let gender = "";
  if (user.gender === "female") {
    gender = '<i class="fas fa-female" data-fa-transform="shrink--32"></i>';
  } else {
    gender = '<i class="fas fa-male" data-fa-transform="shrink--32"></i>';
  }

  output += `
    <li class="user-list__user user">
      <div class="user__short short">
        <div class="short__item avatar">
          <img class="avatar-small" alt="avatar" src="${user.picture.medium}">
        </div>
        <p class="short__item last-name">${user.name.last}</p>
        <p class="short__item first-name">${name}</p>
        <p class="short__item username">${user.login.username}</p>
        <p class="short__item phone">${user.phone}</p>
        <p class="short__item location">${user.location.state}</p>
        <div class="short__item plus">
          <i class="fas fa-plus" data-fa-transform="shrink--24"></i>
        </div>
      </div>
    <div class="user__details details">
      <div class="details__item ins">
        <div class="ins__item person">
          <p class="person__first-name">${name}</p>
          <div class="person__gender">${gender}</div>
        </div>
        <p class="ins__item username"><span>Username</span> ${
          user.login.username
        }</p>
        <p class="ins__item registered-date"><span>Registered</span> ${
          user.registered.date.split("T")[0]
        }</p>
        <div class="ins__item email">
          <p class="email__title" >Email&nbsp;</p>
          <a class="email__address" href="mailto:${user.email}">${
    user.email
  }</a>
        </div>
      </div>
      <div class="details__item ins">
        <p class="ins__item location"><span>Address</span> ${
          user.location.street
        }</p>
        <p class="ins__item location"><span>City</span> ${
          user.location.city
        }</p>
        <p class="ins__item location"><span>Zip Code</span> ${
          user.location.postcode
        }</p>
      </div>
      <div class="details__item ins">
        <p class="ins__item birthday"><span>Birthday</span> ${
          user.dob.date.split("T")[0]
        }</p>
        <div class="ins__item phone">
          <p class="phone__title" >Phone&nbsp;</p>
          <a class="phone__number" href="tel:${user.phone}">${user.phone}</a>
        </div>
        <div class="ins__item cell">
          <p class="cell__title" >Cell&nbsp;</p>
          <a class="cell__number" href="tel:${user.cell}">${user.cell}</a>
        </div>
      </div>
      <div class="details__item ins avatar">
        <img class="avatar-big" alt="avatar-big" src="${user.picture.large}">
      </div>
    </div>
    </li>
  `;
}

function showHide() {
  const plus = document.querySelectorAll(".plus");
  const details = document.querySelectorAll(".details");
  const userInfo = document.querySelectorAll(".user");

  for (let i = 0; i < plus.length; i += 1) {
    userInfo[i].addEventListener("click", function activate() {
      if (!details[i].classList.contains("active")) {
        for (let j = 0; j < details.length; j += 1) {
          if (details[j].classList.contains("active")) {
            details[j].classList.remove("active");
          }
        }
        details[i].classList.add("active");
      } else {
        details[i].classList.remove("active");
      }

      if (plus[i].childNodes[1].classList.contains("fa-plus")) {
        for (let k = 0; k < plus.length; k += 1) {
          if (plus[k].childNodes[1].classList.contains("fa-minus")) {
            plus[k].childNodes[1].classList.remove("fa-minus");
            plus[k].childNodes[1].classList.add("fa-plus");
          }
        }
        plus[i].childNodes[1].classList.remove("fa-plus");
        plus[i].childNodes[1].classList.add("fa-minus");
      } else {
        plus[i].childNodes[1].classList.remove("fa-minus");
        plus[i].childNodes[1].classList.add("fa-plus");
      }
    });
  }
}

function generateList() {
  const list = document.querySelector(".user-list");

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const users = data.results;

      users.forEach(user => {
        generateUser(user, user.name.first);
      });
      list.innerHTML = output;
      showHide();

      const userGender = [
        { label: "Male", value: 0 },
        { label: "Female", value: 0 }
      ];
      const colors = ["#7db6ed", "#434348"];

      users.forEach(user => {
        if (user.gender === "male") {
          userGender[0].value += 1;
        } else {
          userGender[1].value += 1;
        }
      });

      function drawChart() {
        const chart = document.querySelector(".modal__chart");
        chart.width = 800;
        chart.height = 726;
        const ctx = chart.getContext("2d");
        const x = chart.width / 2;
        const y = chart.height / 2;
        let color;

        function calculatePercent(value, total) {
          return ((value / total) * 100).toFixed(1);
        }

        function getTotal() {
          let sum = 0;
          for (let i = 0; i < userGender.length; i += 1) {
            sum += userGender[i].value;
          }
          return sum;
        }

        const total = getTotal();

        function degreeToRadians(angle) {
          return (angle * Math.PI) / 180;
        }

        function calculateEndAngle(index) {
          const angle = (userGender[index].value / total) * 360;
          const inc =
            index === 0 ? 0 : calculateEndAngle(userGender, index - 1);
          return angle + inc;
        }

        function calculateEnd(index) {
          return degreeToRadians(calculateEndAngle(userGender, index, total));
        }

        function calculateStart(index) {
          if (index === 0) {
            return 0;
          }
          return calculateEnd(userGender, index - 1, total);
        }

        for (let i = 0; i < userGender.length; i += 1) {
          color = colors[i];
          const startAngle = calculateStart(userGender, i, total);
          const endAngle = calculateEnd(userGender, i, total);

          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.moveTo(x, y);
          ctx.arc(x, y, y - 200, startAngle, endAngle);
          ctx.fill();
          ctx.font = "13px sans-serif";
          ctx.fillText(
            `${userGender[i].label}: ${calculatePercent(
              userGender[i].value,
              total
            )}%`,
            chart.width - 440,
            y - i * 500 + 250
          );
        }
      }

      drawChart(userGender, colors);

      const showChart = document.querySelector(".show-chart");
      const modal = document.querySelector(".modal");
      const modalChart = document.querySelector(".modal__chart");

      showChart.addEventListener("click", function showHideModal() {
        modal.classList.toggle("hidden");
        if (!modal.classList.contains("hidden")) {
          showChart.textContent = "Hide Chart";
        } else {
          showChart.textContent = "Show Chart";
        }
      });

      document.addEventListener("click", e => {
        if (e.target !== showChart && e.target !== modalChart) {
          modal.classList.add("hidden");
          if (!modal.classList.contains("hidden")) {
            showChart.textContent = "Hide Chart";
          } else {
            showChart.textContent = "Show Chart";
          }
        }
      });

      // Find matches /////////////////////////////////////////////

      const searchField = document.querySelector(".search__field");
      const word = searchField.innerHTML;

      function findMatches() {
        return users.filter(user => {
          const regex = new RegExp(word, "gi");
          return user.name.first.match(regex);
        });
      }

      function displayMatches() {
        const matchArray = findMatches(this.value, users);
        matchArray
          .map(user => {
            console.log(user.name.first);
            console.log("");
            list.innerHTML = "";
            const regex = new RegExp(this.value, "gi");
            const name = user.name.first.replace(
              regex,
              `<span class="hilight">${this.value}</span>`
            );
            return generateUser(user, name);
          })
          .join("");
      }

      searchField.addEventListener("change", displayMatches);
      searchField.addEventListener("keyup", displayMatches);
    })
    .catch(error => console.log(error));
}

function generatePage() {
  const page = `
  <div class="wrapper">
    <form class="search">
    <input type="text" class="search__field" placeholder="First Name">
    </form>
    <a class="show-chart">Show Chart</a>
    <div class="head">
      <p class="head__item"></p>
      <p class="head__item">Last</p>
      <p class="head__item">First</p>
      <p class="head__item">Username</p>
      <p class="head__item">Phone</p>
      <p class="head__item">Location</p>
      <p class="head__item"></p>
    </div>
    <ul class="user-list"></ul>
    <div class="modal hidden">
      <h2 class="modal__title">Gender of users</h2>
      <canvas class="modal__chart"></canvas>
    </div>
  `;
  document.body.innerHTML = page;
  generateList();
}

document.addEventListener("DOMContentLoaded", generatePage);
