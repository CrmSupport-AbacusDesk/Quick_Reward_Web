import { Injectable } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog:MatDialog) { }

  
}
// import { Injectable } from '@angular/core';
// import Swal from 'sweetalert2';
// @Injectable({
//   providedIn: 'root'
// })
// export class DialogService {

//   constructor() { }

//   delete(msg:any)
//   {
//     return Swal({
//       title: 'Are you sure?',
//       text: 'You will not be able to recover this '+msg,
//       type: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'No, keep it'
//     }).then((result) => {
//       if (result.value) {
//         return true;
//         // For more information about handling dismissals please visit
//         // https://sweetalert2.github.io/#handling-dismissals
//       } else if (result.dismiss === Swal.DismissReason.cancel) {
//         Swal(
//           'Cancelled',
//           'Your '+ msg +' is safe &#x263A;',
//           'error'
//           )
//           return false;
          
//         }
//       })
//     }

//   confirmation(msg:any)
//   {
//     return Swal({
//     title: 'Are you sure?',
//     text: 'You change in to '+msg,
//     type: 'warning',
//     showCancelButton: true,
//     confirmButtonText: 'Yes, Change it!',
//     cancelButtonText: 'No, keep it'
//     }).then((result) => {
//     if (result.value) {
//     return true;
//     // For more information about handling dismissals please visit
//     // https://sweetalert2.github.io/#handling-dismissals
//     } else if (result.dismiss === Swal.DismissReason.cancel) {
//     Swal(
//     'Cancelled',
//     'Your '+ msg +' data is not modfied :)',
//     'error'
//     )
//     return false;
//     }
//     })
//   }

//   success(title:any,msg:any)
//   {
//     Swal(
//       title+'!',
//       msg+'.',
//       'success'
      
//       )
//   }

//   error(msg:any)
//   {
//     Swal({
//       type: 'error',
//       title: 'Oops...',
//       text: msg,
//       // footer: '<a href>Why do I have this issue?</a>'
//     })
//   }

// }
