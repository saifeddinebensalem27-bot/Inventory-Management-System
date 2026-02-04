// import { useState } from "react";
// import ArticleCodeTable from "./ArticleCodeTable";

// export default function ArticleTable({ articles, reload }) {
//   const [openId, setOpenId] = useState(null);

//   return (
//     <table>
//       <thead>
//         <tr>
//           <th>Name</th>
//           <th>Category</th>
//           <th>Unit</th>
//         </tr>
//       </thead>
//       <tbody>
//         {articles.map((a) => (
//           <>
//             <tr
//               key={a.id}
//               onClick={() =>
//                 setOpenId(openId === a.id ? null : a.id)
//               }
//             >
//               <td>{a.nomArticle}</td>
//               <td>{a.category?.name}</td>
//               <td>{a.unite}</td>
//             </tr>

//             {openId === a.id && (
//               <tr>
//                 <td colSpan="3">
//                   <ArticleCodeTable articleId={a.id} />
//                 </td>
//               </tr>
//             )}
//           </>
//         ))}
//       </tbody>
//     </table>
//   );
// }
