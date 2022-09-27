const HOST = "https://api-link-manager.herokuapp.com"

function requestUrl(url, type) {
    return $.ajax({
        url: url,
        type: type,
        crossDomain: true,
        error: function(message) {
            console.log(message.responseText)
        }
    });
}

function loadLinks() {
    $("#links-tbody").children().remove()

    requestUrl(`${HOST}/link/readall`, "GET").done(function(data) {
        if (!data) {
            alert('Nenhum link encontrado.')
            return
        }

        for (link of data) {
            let row =
                `
            <tr>
                <th class="link-id">${link.id}</th>
                <td class="label">${link.label}</td>
                <td class="url">${link.url}</td>
                <td class="actions">
                    <button type="button" class="btn btn-outline-warning edit-btn">Editar</button>
                    <button type="button" class="btn btn-outline-danger remove-btn">Remover</button>
                </td>
            </tr>
            `
            $("#links-tbody").append(row)
        }
    })
}


//events
$(document).ready(function() {
    loadLinks()
})

$('#toggle-create-form').click(function() {
    $('#create-form').toggle()
})

$('#create-form').on("submit", function(event) {
    event.preventDefault()

    var label = $('#create-label-input').val()
    var url = $('#create-url-input').val()

    requestUrl(`${HOST}/link/save?url=${url}&label=${label}`, "POST").done(function(response) {
        console.log(response)
    })

    $('#create-label-input').val('')
    $('#create-url-input').val('')
    loadLinks()
})

$('#edit-form').on("submit", function(event) {
    event.preventDefault()

    var id = $('#edit-id-input').val()
    var label = $('#edit-label-input').val()
    var url = $('#edit-url-input').val()

    requestUrl(`${HOST}/link/edit?url=${url}&label=${label}&id=${id}`, "POST").done(function(response) {
        console.log(response)
    })

    $('#edit-label-input').val('')
    $('#edit-url-input').val('')
    loadLinks()
})

$(document).on('click', '.remove-btn', function() {
    var link_id = $(this).parent().parent().find(".link-id").html()

    requestUrl(`${HOST}/link/delete?id=${link_id}`, "POST").done(function(response) {
        console.log(response)
    })
    
    loadLinks()
})

$(document).on('click', '.edit-btn', function() {
    var link_id = $(this).parent().parent().find(".link-id").html()
    var label = $(this).parent().parent().find(".label").html()
    var url = $(this).parent().parent().find(".url").html()

    $('#edit-id-input').val(link_id)
    $('#edit-label-input').val(label)
    $('#edit-url-input').val(url)

    $('#edit-form').toggle()
})
