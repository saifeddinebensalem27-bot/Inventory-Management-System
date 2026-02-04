// import { useEffect, useState } from "react";
// import { getArticleCodes } from "../services/articleService";
// import AddArticleCodeModal from "./AddArticleCodeModal";

// export default function ArticleCodeTable({ articleId }) {
//   const [codes, setCodes] = useState([]);
//   const [show, setShow] = useState(false);

//   const loadCodes = async () => {
//     const res = await getArticleCodes(articleId);
//     setCodes(res.data["hydra:member"]);
//   };

//   useEffect(() => {
//     loadCodes();
//   }, []);

//   return (
//     <div>
//       <button onClick={() => setShow(true)}>
//         + Add Version
//       </button>

//       <table>
//         <thead>
//           <tr>
//             <th>Code</th>
//             <th>Brand</th>
//             <th>Qty</th>
//           </tr>
//         </thead>
//         <tbody>
//           {codes.map((c) => (
//             <tr key={c.id}>
//               <td>{c.codeArticle}</td>
//               <td>{c.marque}</td>
//               <td>{c.quantite}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {show && (
//         <AddArticleCodeModal
//           articleId={articleId}
//           onClose={() => setShow(false)}
//           onSaved={loadCodes}
//         />
//       )}
//     </div>
//   );
// }
