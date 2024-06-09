const id = document.querySelector('input[name="id"]')?.value;

function onUpsertBlock(id) {
  window.location.href = `/blocks/${id}`;
}

async function onDelBlock(id) {
  await axios.delete(`http://localhost:5500/blocks/${id}`);
  location.reload()
}

// enctype="multipart/form-data"
async function onImportBlock(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  formData.set('id', id);
  try {
    const res = await axios.post('/api/blocks/import', formData);

    if (!res?.data?.success) {
      alert('fail');
      return;
    }

    alert('success');
    // window.location.reload();
  } catch {
    alert('error');
  }
}

function onExportBlock() {
  alert('Chill');
}