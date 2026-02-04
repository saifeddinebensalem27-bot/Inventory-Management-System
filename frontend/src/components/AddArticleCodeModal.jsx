// import { useState } from "react";
// import { createArticleCode } from "../services/articleCodeService";

// export default function AddArticleCodeModal({
//   articleId,
//   onClose,
//   onSaved,
// }) {
//   const [form, setForm] = useState({
//     code_article: "",
//     marque: "",
//     quantite: 0,
//   });

//   const submit = async () => {
//     await createArticleCode(articleId, form);
//     onSaved();
//     onClose();
//   };

//   return (
//     <div className="modal">
//       <h3>Add Version</h3>

//       <input
//         placeholder="Code"
//         onChange={(e) =>
//           setForm({ ...form, code_article: e.target.value })
//         }
//       />

//       <input
//         placeholder="Brand"
//         onChange={(e) =>
//           setForm({ ...form, marque: e.target.value })
//         }
//       />

//       <input
//         type="number"
//         placeholder="Quantity"
//         onChange={(e) =>
//           setForm({ ...form, quantite: e.target.value })
//         }
//       />

//       <button onClick={submit}>Save</button>
//       <button onClick={onClose}>Cancel</button>
//     </div>
//   );
// }
