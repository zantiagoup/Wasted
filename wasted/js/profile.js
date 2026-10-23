/*
  Profile screen. Counts the scans, turns them into kg of CO2 avoided, shows a
  badge every 10 scans up to 50, and lets the user delete the whole
  localStorage history.

  kg of CO2e avoided per item = EPA WARM v16 (Dec 2023) "recycling minus
  landfilling" factor, in metric tons per short ton, times the weight of one
  typical item. The factors are US averages, so for Guadalajara they are an
  estimate, not a measurement.
    PET         1.056 t/short ton x 9.25 g bottle    (Beverage Marketing Corp. 2014)
    Aluminium   9.148 x 12.99 g can                  (Aluminum Association KPI 2019)
    Glass       0.296 x 253 g bottle or jar          (CalRecycle 2026)
    Cardboard   3.317 x 340 g small box
    Paper       3.998 x 4.99 g A4 sheet
    Organic     0.654 (composting) x 100 g
    Electronics 0.924 x 1 kg small device
  Batteries (Hazardous) have no WARM factor, so they count as a scan but add
  no CO2. Neither does Unknown.
  https://www.epa.gov/warm
*/
(function () {
  "use strict";

  var KG_PER_ITEM = {
    PET: 0.0108,
    Aluminium: 0.131,
    Glass: 0.083,
    Cardboard: 1.24,
    Paper: 0.022,
    Organic: 0.072,
    Electronics: 1.02
  };

  // EPA Greenhouse Gas Equivalencies, Calculations and References (2026).
  var KG_PER_KM_DRIVEN = 0.393 / 1.609;
  var KG_PER_PHONE_CHARGE = 0.0124;
  var KG_PER_TREE_PER_DAY = 60 / 365;

  // One badge every 10 scans. Each one, once unlocked, explains your impact
  // in a different everyday unit.
  var BADGES = [
    { scans: 10, name: "Seedling", fact: function (t) {
      return "You kept " + t.items + " things out of the landfill.";
    } },
    { scans: 20, name: "Sorter", fact: function (t) {
      return "Your " + round(t.kg) + " kg of CO₂ is like not driving a car for " + round(t.kg / KG_PER_KM_DRIVEN) + " km.";
    } },
    { scans: 30, name: "Recycler", fact: function (t) {
      return "That is the CO₂ of charging a phone " + Math.round(t.kg / KG_PER_PHONE_CHARGE) + " times.";
    } },
    { scans: 40, name: "Guardian", fact: function (t) {
      return "A city tree needs " + Math.round(t.kg / KG_PER_TREE_PER_DAY) + " days to soak up the CO₂ you avoided.";
    } },
    { scans: 50, name: "Champion", fact: function (t) {
      return "Plastic never fully goes away, it breaks into microplastics. You kept " + t.plastic + " pieces out of that.";
    } }
  ];

  var count = document.getElementById("scan-count");
  var kgText = document.getElementById("co2-kg");
  var progress = document.getElementById("badge-progress");
  var meter = document.getElementById("badge-meter");
  var next = document.getElementById("badge-next");
  var list = document.getElementById("badge-list");
  var tip = null;

  function round(n) {
    if (n === 0) return "0";
    return n < 10 ? n.toFixed(1) : String(Math.round(n));
  }

  // The kg number counts up to its value, like a ring closing on Apple Watch.
  // With Reduce Motion it just appears.
  function countUp(kg) {
    if (kg === 0 || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      kgText.textContent = round(kg);
      return;
    }
    var start = performance.now();
    function frame(now) {
      var p = Math.min((now - start) / 900, 1);
      kgText.textContent = round(kg * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function totals(history) {
    var t = { items: history.length, kg: 0, plastic: 0 };
    for (var i = 0; i < history.length; i++) {
      t.kg += KG_PER_ITEM[history[i].category] || 0;
      if (history[i].category === "PET") t.plastic++;
    }
    return t;
  }

  // Shows the fact of one badge in a bubble whose arrow points at that badge.
  function showTip(index, t) {
    if (!tip) {
      tip = document.createElement("p");
      tip.className = "w-badge-tip";
      tip.setAttribute("aria-live", "polite");
      list.parentNode.insertBefore(tip, list);
    }
    tip.textContent = BADGES[index].name + ": " + BADGES[index].fact(t);
    tip.style.setProperty("--arrow-x", ((index + 0.5) / BADGES.length * 100) + "%");

    var buttons = list.querySelectorAll(".w-badge--on");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-pressed", String(i === index));
    }
  }

  function render() {
    var history = JSON.parse(localStorage.getItem("wasted-history")) || [];
    var t = totals(history);
    var unlocked = Math.min(Math.floor(t.items / 10), BADGES.length);

    count.textContent = t.items;
    countUp(t.kg);

    // The bar fills from one badge to the next.
    var inBadge = unlocked === BADGES.length ? 10 : t.items % 10;
    meter.style.width = (inBadge * 10) + "%";
    progress.setAttribute("aria-valuenow", inBadge);
    next.textContent = unlocked === BADGES.length
      ? "Every badge unlocked. Thank you."
      : (10 - inBadge) + (10 - inBadge === 1 ? " scan" : " scans") + " to " + (unlocked ? "your next badge" : "your first badge");

    list.innerHTML = "";
    BADGES.forEach(function (badge, i) {
      var on = i < unlocked;
      var item = document.createElement("li");
      item.style.setProperty("--i", i);
      var el = document.createElement(on ? "button" : "span");
      el.className = "w-badge" + (on ? " w-badge--on" : "");
      if (on) {
        el.type = "button";
        el.addEventListener("click", function () { showTip(i, t); });
      }
      el.innerHTML = '<span class="w-badge__disc"><svg class="w-i" aria-hidden="true" focusable="false"><use href="#i-' +
        (on ? "award" : "lock") + '"/></svg></span>';
      el.append(on ? badge.name : badge.scans + " scans");
      item.appendChild(el);
      list.appendChild(item);
    });

    if (tip) {
      tip.remove();
      tip = null;
    }
    // The newest badge speaks first.
    if (unlocked > 0) showTip(unlocked - 1, t);
  }

  document.getElementById("delete-history").addEventListener("click", function () {
    if (!confirm("Delete your history, your streak and your badges? This cannot be undone.")) return;
    localStorage.removeItem("wasted-history");
    render();
  });

  render();
})();
