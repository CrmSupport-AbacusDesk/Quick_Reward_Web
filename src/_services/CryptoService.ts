import { Injectable, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js'

interface CryptoJSAesJsonStructure {
    ct: string;
    iv?: string;
    s?: string;
}



@Injectable({ providedIn: 'root' })
export class CryptoService implements OnInit {
    private secretKey: string = 'vikas';
    
    constructor() {
    }
    
    ngOnInit() { }
    
    
    
    encryptData(payload: any): any {
        return CryptoJS.AES.encrypt(JSON.stringify(payload), this.secretKey, {format: this.CryptoJSAesJson}).toString();
    }
    
    decryptData(payload: any): any {
        return JSON.parse(CryptoJS.AES.decrypt(payload , this.secretKey, {format: this.CryptoJSAesJson}).toString(CryptoJS.enc.Utf8));
    }
    
    CryptoJSAesJson = {
        stringify: function (cipherParams) {
            var j: CryptoJSAesJsonStructure = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
            if (cipherParams.iv) j.iv = cipherParams.iv.toString();
            if (cipherParams.salt) j.s = cipherParams.salt.toString();
            return JSON.stringify(j);
        },
        parse: function (jsonStr) {
            var j = JSON.parse(jsonStr);
            var cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(j.ct)});
            if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
                if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
                    return cipherParams;
        }
    }
    
    encryptId(id) {
        const encrypted = CryptoJS.AES.encrypt(id.toString(), this.secretKey).toString();
        const modifiedEncryptedId = encrypted.replace(/\//g, '_');
        return modifiedEncryptedId;
    }
    decryptId(encryptedId) {
        const bytes = CryptoJS.AES.decrypt(encryptedId, this.secretKey,);
        
        return bytes.toString(CryptoJS.enc.Utf8);
    }
    
    
}