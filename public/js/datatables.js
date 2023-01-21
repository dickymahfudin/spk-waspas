$(document).ready(function () {
  const url = $('#dataTable').attr('url');
  const parsUrl = url.split('/')[1];
  const state = $('#dataTable').attr('state');

  $.ajax({
    type: 'GET',
    url,
    dataType: 'json',
    success: function (response) {
      const column = { data: 'id', title: '', searchable: false, sortable: false };
      if (state === 'full') {
        response.columns.push({
          ...column,
          render: function (id, type, full, meta) {
            return `<span>
              <a href="/${parsUrl}/detail/${id}" class="modal-open" title="Detail ${full.name}" id="${id}"><i class="fas fa-info-circle"></i></a> | 
              <a href="/${parsUrl}/form/${id}" class="modal-open" title="Edit ${full.name}" id="${id}"><i class="fas fa-edit"></i></a> | 
              <a href="/${parsUrl}/delete/${id}" onclick="return confirm('Anda yakin ingin menghapus item ini?');" title="Delete ${full.name}" id="${id}"><i class="fas fa-trash text-danger"></i></a>
              </span>`;
          },
        });
      } else if (state === 'no-detail') {
        response.columns.push({
          ...column,
          render: function (id, type, full, meta) {
            return `<span>
              <a href="/${parsUrl}/form/${id}" class="modal-open" title="Edit ${full.name}" id="${id}"><i class="fas fa-edit"></i></a> | 
              <a href="/${parsUrl}/delete/${id}" onclick="return confirm('Anda yakin ingin menghapus item ini?');" title="Delete ${full.name}" id="${id}"><i class="fas fa-trash text-danger"></i></a>   
              </span>`;
          },
        });
      } else if (state === 'edit') {
        response.columns.push({
          ...column,
          render: function (id, type, full, meta) {
            return `<span>
              <a href="/${parsUrl}/form/${id}" class="modal-open" title="Edit ${full.name}" id="${id}"><i class="fas fa-edit"></i></a>
              </span>`;
          },
        });
      }

      $('#dataTable').DataTable({
        rowReorder: {
          selector: 'td:nth-child(2)',
        },
        language: {
          paginate: {
            next: '<i class="fa fa-chevron-right"></i>',
            previous: '<i class="fa fa-chevron-left"></i>',
          },
        },
        processing: true,
        retrieve: true,
        responsive: true,
        searching: false,
        // dom: "Blrtip",
        data: response.data,
        columns: response.columns,
      });
    },
  });
});
