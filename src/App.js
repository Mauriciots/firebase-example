import "./App.css";
import { useCallback, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  doc,
} from "firebase/firestore";
import { db } from "./firebase-config";
import { faker } from "@faker-js/faker";

function App() {
  const [updateData, setUpdateData] = useState(true);
  const [data, setData] = useState([]);
  const postsCollection = collection(db, "posts");

  const loadData = useCallback(async () => {
    const q = query(postsCollection);
    const response = await getDocs(q);
    setData(response.docs);
  }, [postsCollection]);

  async function handleButtonClick() {
    await addDoc(postsCollection, {
      title: `${faker.word.adjective()} ${faker.word.noun()}`,
      body: faker.lorem.sentence(5),
    });
    setUpdateData(true);
  }

  async function deleteMyDoc(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
    setUpdateData(true);
  }

  async function updateMyDoc(id) {
    const docRef = doc(db, "posts", id);
    await updateDoc(docRef, {
      body: faker.lorem.sentence(10),
    });
    setUpdateData(true);
  }

  useEffect(() => {
    if (updateData) {
      loadData();
      setUpdateData(false);
    }
  }, [updateData, loadData]);

  return (
    <main>
      <section>
        {data.map((doc) => {
          const data = doc.data();
          return (
            <article key={doc.id}>
              <h2>{data.title}</h2>
              <p>{data.body}</p>
              <button onClick={() => deleteMyDoc(doc.id)}>Delete</button>
              <button onClick={() => updateMyDoc(doc.id)}>Update</button>
            </article>
          );
        })}
      </section>
      <hr />
      <div>
        <button onClick={handleButtonClick}>Add doc</button>
      </div>
    </main>
  );
}

export default App;
