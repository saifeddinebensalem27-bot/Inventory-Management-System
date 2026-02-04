// import { useState } from "react";
// import { createArticle } from "../services/articleService";

// export default function AddArticleModal({ onClose, onSaved }) {
//   const [form, setForm] = useState({
//     nom_article: "",
//     unite: "",
//     category: "/api/categories/1",
//   });

//   const submit = async () => {
//     await createArticle(form);
//     onSaved();
//     onClose();
//   };

//   return (
//     <div className="modal">
//       <h3>Add Article</h3>

//       <input
//         placeholder="Name"
//         onChange={(e) =>
//           setForm({ ...form, nom_article: e.target.value })
//         }
//       />

//       <input
//         placeholder="Unit"
//         onChange={(e) =>
//           setForm({ ...form, unite: e.target.value })
//         }
//       />

//       <button onClick={submit}>Save</button>
//       <button onClick={onClose}>Cancel</button>
//     </div>
//   );
// }
