import { Component, OnInit, } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { StatusModalComponent } from '../status-modal/status-modal.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AddItemComponent } from 'src/app/add-item/add-item.component';

import * as $ from "jquery";
import { CryptoService } from 'src/_services/CryptoService';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';


@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    animations: [slideToTop()]
})
export class OrderDetailComponent implements OnInit {
    orderType: any = 'order';
    status: any;
    skLoading: boolean = false;

    data: any = {};
    login_data: any = [];
    order_id: any;
    order_item: any = [];
    invoice_bill_item: any = [];
    order_logs: any = [];
    order_detail: any = [];
    login_dr_id: any;
    editqty: any = false;
    distrbutorId: any;
    img_url:any=''
    pageType: any = {};
    urlType: any = {};
    logined_user_data: any = {};
    userData: any;

    constructor(public route: ActivatedRoute, public service: DatabaseService, public cryptoService: CryptoService, public toast: ToastrManager, public dialog: MatDialog, public session: sessionStorage, public dialogs: DialogComponent, public router: Router, public alert: DialogComponent) {
        this.img_url = this.service.uploadUrl + 'order_docs/';
        this.login_data = this.session.getSession();
        this.login_data = this.login_data.value.data;

        if (this.login_data.access_level != '1') {
            this.login_dr_id = this.login_data.id;
        }
        this.userData = JSON.parse(localStorage.getItem('st_user'));
        this.logined_user_data = this.userData['data'];
        console.log(this.logined_user_data, 'logined_user_data');
        this.route.params.subscribe(params => {
            let id = params.id.replace(/_/g, '/')
            if (params.id) {
                this.order_id = this.cryptoService.decryptId(id);
                this.service.currentUserID = this.cryptoService.decryptId(id);
                this.urlType = params.type
                this.status = this.route.queryParams['_value']['status'];
                this.pageType = this.route.queryParams['_value']['pageType'];
                if (id) {
                    this.orderDetail();
                }
            }

        });
    }

    ngOnInit() {


    }


    loader: any;
    edit_cash_discount: any = false;
    FsCat: any = false;

    Order_Amount: any;
    async orderDetail() {
        this.loader = 1;
        this.skLoading = true;
        // const fetchUrl = await fetch(this.dbUrl + "Login/sessionCheck", {
        //     headers: { Authorization: 'Bearer ' + this.st_user.token }
        //   })
        //   const resp = await fetchUrl.json()
        await this.service.post_rqst({ 'id': this.order_id }, this.pageType == 'order' ? "Enquiry/primaryOrderDetail" : this.pageType == 'quotation' ? "Enquiry/quotationDetail" : "Order/primaryOrderDetail").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.skLoading = false;
                this.order_detail = result['result'];
                this.distrbutorId = this.order_detail['dr_id'];

                this.order_item = result['result']['item_info'];
                this.invoice_bill_item = result['invoice_bill'];
                this.order_logs = result['result']['order_log'];
                this.order_detail.order_cgst = this.order_detail.order_gst / 2;
                this.order_detail.order_cgst = parseFloat(this.order_detail.order_cgst).toFixed(2);
                this.order_detail.netBreakup = (parseFloat(this.order_detail.order_grand_total) / 1.18)
                this.order_detail.gstBreakup = parseFloat(this.order_detail.order_grand_total) - parseFloat(this.order_detail.netBreakup)
                this.order_detail.gstBreakup = this.order_detail.gstBreakup.toFixed(2)
                this.order_detail.netBreakup = this.order_detail.netBreakup.toFixed(2)
                this.Order_Amount = Number(this.order_detail.order_total) + Number(this.order_detail.order_discount);


                for (let i = 0; i < this.order_item.length; i++) {
                    if (this.order_item[i]['brand'] == 'FS') {
                        this.FsCat = true
                    }
                    else {
                        this.FsCat = false;
                    }
                }

                this.order_item.map((row) => {
                    row.editqty = false

                })
                setTimeout(() => {
                    this.loader = '';

                }, 700);
            } else {
                setTimeout(() => {
                    this.loader = '';

                }, 700);
                this.skLoading = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        }))
    }
    goTODetail(id) {
        this.router.navigate(['/billing-details/' + id], { queryParams: { id } });
    }
    openDialog(): void {
        const dialogRef = this.dialog.open(StatusModalComponent, {
            width: this.order_detail.order_status == 'dispatchPlanning' || this.order_detail.order_status == 'partialDispatched' ? '' : '800px',
            panelClass: this.order_detail.order_status == 'dispatchPlanning' || this.order_detail.order_status == 'partialDispatched' ? 'min400' : 'cs-model',
            data: {
                'order_status': this.order_detail.order_status,
                'order_id': this.order_id,
                'organisation_name': this.order_detail.organisation_name,
                'transport_id': this.order_detail.transport_id,
                'from': 'primary_order',
                'order_item': this.order_item,
                'FsCat': this.FsCat,
                'pageType': this.pageType,
                'openOrder': this.order_detail.open_order,
                'creditLimit': this.order_detail.credit_limit,

                reason: ''
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.orderDetail();
            }
        });
    }
    goToImage(image) {
        const dialogRef = this.dialog.open(ImageModuleComponent, {
            panelClass: 'Image-modal',
            data: {
                'image': image,
                'type': 'base64'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });

    }
    deleteOrderitem(order_id, index) {
        this.alert.confirm("You want to delet this item !").then((result) => {
            if (result) {
                this.service.post_rqst({ 'id': order_id }, "Order/primaryOrderDeleteItem")
                    .subscribe((result => {
                        if (result['status'] == 200) {
                            this.toast.successToastr('Item Deleted Successfully');
                            this.order_item.splice(index, 1)
                            this.orderDetail();
                        } else {
                            this.orderDetail();
                            this.toast.errorToastr(result['status'])
                        }
                    }))
            }
        })
    }

    // }
    order_detail1: any = {}
    edit_qty() {
        this.editqty = true;
    }
    Update_qty(id) {
        let index = this.order_item.findIndex(row => row.id == id)
        let cart_data = []
        let Amount = (this.order_item[index].qty * this.order_item[index].net_price)
        this.order_item[index].product_price = this.order_item[index].price
        this.order_item[index].discounted_price = this.order_item[index].discount_amount
        this.order_item[index].dr_disc = this.order_item[index].discount_percent
        this.order_item[index].amount = Amount
        this.order_item[index].gst_amountbeforfix = (Amount * this.order_item[index].gst_percent) / 100
        this.order_item[index].gst_amount = parseFloat(this.order_item[index].gst_amountbeforfix).toFixed()
        this.order_item[index].total_amount = parseFloat(this.order_item[index].gst_amount) + Amount;
        cart_data.push(this.order_item[index])

        this.service.post_rqst({ 'id': id, 'cart_data': cart_data }, "order/primaryOrderUpdateItem").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.editqty = false;
                this.toast.successToastr(result['statusMsg']);
                this.orderDetail()
            }
            else {
                this.editqty = false;
                this.toast.errorToastr(result['statusMsg']);
            }
        }))
    }


    amount: any = 0;
    gst_amount: any = 0;
    subtotal: any = 0;
    second_subtotal: any = 0;
    cd_amount: any = 0;

    back() {
        window.history.go(-1);
    }
    addItem() {
        if (this.pageType != 'quotation' && this.pageType != 'order') {
            let dr_id = this.order_detail.dr_id
            let order_id = this.order_id
            let state = this.order_detail.state
            let type = this.order_detail.type;
            let company_name = this.order_detail.company_name;
            let name = this.order_detail.name;
            let contact_person = this.order_detail.mobile;
            const dialogRef = this.dialog.open(AddItemComponent, {
                width: '1200px',
                panelClass: 'cs-modal',
                disableClose: true,
                data: {
                    'dr_id': dr_id,
                    'order_id': order_id,
                    'type': type,
                    'company_name': company_name,
                    'name': name,
                    'contact_person': contact_person,
                    'pageType': this.pageType,
                    'state': state
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result == true) {
                    this.orderDetail();
                }
            });
        }
        else {
            this.router.navigate(['/site-order/' + this.urlType + '/order-detail/' + this.order_id + '/site-order-add/' + this.order_id + '/' + this.urlType,])
        }
    }

    exportPdf() {
        this.loader = 1;
        this.skLoading = true;
        let pdfUrl = ''
        let linkUrl = ''
        if (this.pageType == 'quotation') {
            pdfUrl = "Order/exportQuotationPdf"
            linkUrl = 'quotationPdf/'
        } else {
            pdfUrl = "Order/exportOrderPdf"
            linkUrl = 'orderPdf/'
        }
        this.service.post_rqst({ 'id': this.order_id }, pdfUrl).subscribe((result) => {
            result = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

            if (result['statusCode'] == 200) {
                this.skLoading = false;

                window.open(this.service.uploadUrl + linkUrl + result['file_name']);
                setTimeout(() => {
                    this.loader = '';

                }, 700);
            } else {
                setTimeout(() => {
                    this.loader = '';

                }, 700);
                this.skLoading = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        }
            , err => {
                this.skLoading = false;

            }
        )
    }

    moveQuotationDetail(pageType, id) {
        this.pageType = pageType;
        this.order_id = id;
        this.orderDetail();
    }

}
