import * as $ from 'jquery'

export class ProductService{


     getProductData (url:string, onSuccess:Function, context:Object) {
        return $.ajax({
            type: "GET",
            url: url,
            async: true,
            success: onSuccess.bind(context)
        });
    };


}