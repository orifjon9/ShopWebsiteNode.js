const deleteProduct = (btn) => {
    const productId = btn.parentNode.querySelector("[name=productId]").value;
    const token = btn.parentNode.querySelector("[name=_csrf]").value;
    const productElement = btn.closest('article');

    fetch(`/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': token
        }
    }).then(result => {
        console.log(result.json());
        productElement.parentNode.removeChild(productElement);
    }).catch(err => console.log(err.json()));
};