async function carregarAvisos() {
  const res = await fetch("https://portalescolar-kgtz.onrender.com/avisos");
  const avisos = await res.json();

  const lista = document.getElementById("listaAvisos");

  avisos.forEach(aviso => {
    const [ano, mes, dia] = aviso.data.split('T')[0].split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;

    const card = document.createElement("div");
    card.className = "card mb-2 border-info";
    card.id = 'aviso-' + aviso.id;
    card.innerHTML = `
      <div class="card-body d-flex justify-content-between align-items-start">
        <div>
          <h5 class="card-title">${aviso.titulo}</h5>
          <p class="card-text">
            ${aviso.descricao ? aviso.descricao + '<br>' : ''}
            <small class="text-muted">📅 ${dataFormatada}</small>
          </p>
        </div>
        <button onclick="removerAviso(${aviso.id})" class="btn btn-sm btn-outline-danger ms-2">🗑️ Remover</button>
      </div>
    `;
    lista.appendChild(card);

    if (window.calendar) {
      window.calendar.addEvent({
        id: String(aviso.id),
        title: aviso.titulo,
        date: aviso.data.split('T')[0]
      });
    }
  });
}