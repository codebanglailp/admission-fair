// public/src/app.js
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp,
         onSnapshot, query, orderBy } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase.js";

/* ---------- Firebase Init ---------- */
const app   = initializeApp(firebaseConfig);
const db    = getFirestore(app);
const col   = collection(db, "visitors");

/* ---------- Form Submit ---------- */
document.getElementById("entryForm").addEventListener("submit", async e => {
  e.preventDefault();
  const f   = e.target.elements;
  const ssc = parseFloat(f.sscGPA.value);
  const hsc = parseFloat(f.hscGPA.value);

  if (ssc > 5 || hsc > 5){
    alert("GPA ৫ এর বেশি দেওয়া যাবে না!");
    return;
  }

  try{
    await addDoc(col, {
        name:           f.name.value.trim(),
        phone:          f.phone.value.trim(),
        address:        f.address.value.trim(),
        sscGPA:         ssc,
        hscGPA:         hsc,
        totalGPA:       +(ssc + hsc).toFixed(2),
        formPurchased:  f.formPurchased.checked,
        formSubmitted:  f.formSubmitted.checked,
        volunteer:      f.volunteer.value,
        timestamp:      serverTimestamp()
    });
    e.target.reset();
  }catch(err){
    console.error(err);
    alert("ডেটা সেভ হয়নি! কনসোল দেখুন।");
  }
});

/* ---------- Live Table Render ---------- */
const tbody = document.querySelector("#dataTable tbody");

onSnapshot(query(col, orderBy("timestamp","desc")), snap => {
  tbody.innerHTML = "";
  snap.forEach(doc => {
    const d = doc.data();
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${d.name}</td>
        <td>${d.phone}</td>
        <td>${d.totalGPA}</td>
        <td>${d.formPurchased ? "✔" : ""}</td>
        <td>${d.formSubmitted ? "✔" : ""}</td>
        <td>${
            d.timestamp && d.timestamp.toDate
                ? d.timestamp.toDate().toLocaleString("bn-BD", { hour12: false })
                : ""
            }
        </td>
      </tr>
    `);
  });
});
