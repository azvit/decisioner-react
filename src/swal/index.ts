import Swal from "sweetalert2";

export function questionModal(text: string) {
    return Swal.fire({
        title: 'Are you shure?',
        icon: 'question',
        text: text,
        showCancelButton: true,
        showConfirmButton: true
    })
}

export function successAlert() {
    return Swal.fire({
        title: 'Success!',
        icon: 'success',
        text: '',
        showConfirmButton: true
    })
}

export function errorAlert(message: string) {
    return Swal.fire({
        title: 'Error!',
        icon: 'error',
        text: message,
        showConfirmButton: true
    })
}