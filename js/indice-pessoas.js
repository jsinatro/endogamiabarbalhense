(function () {
  const DATA_URL = '/data/pessoas.json';
  const SEARCH_DEBOUNCE_MS = 200;

  const state = {
    pessoas: [],
    searchTerm: '',
    apenasFalecidos: false,
  };

  const elements = {
    searchInput: document.getElementById('indice-search'),
    apenasFalecidos: document.getElementById('apenas-falecidos'),
    totalResultados: document.getElementById('total-resultados'),
    listaResultados: document.getElementById('lista-resultados'),
    status: document.getElementById('indice-status'),
  };

  function normalizeText(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function formatDate(value) {
    if (!value) return '';
    const [year, month, day] = String(value).split('-');
    if (!year || !month || !day) return value;
    return `${day}/${month}/${year}`;
  }

  function matchesSearch(pessoa, normalizedTerm) {
    if (!normalizedTerm) return true;

    const fields = [
      pessoa.nome,
      pessoa.id,
      pessoa.local,
      ...(Array.isArray(pessoa.apelidos) ? pessoa.apelidos : []),
    ];

    return fields.some((field) => normalizeText(field).includes(normalizedTerm));
  }

  function filterPessoas() {
    const normalizedTerm = normalizeText(state.searchTerm);

    return state.pessoas
      .filter((pessoa) => {
        if (state.apenasFalecidos && pessoa.vivo !== false) {
          return false;
        }

        return matchesSearch(pessoa, normalizedTerm);
      })
      .sort((a, b) => String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR'));
  }

  function createMetaLine(pessoa) {
    const parts = [];

    if (pessoa.nascimento || pessoa.obito) {
      const nascimento = formatDate(pessoa.nascimento) || '?';
      const obito = formatDate(pessoa.obito) || '—';
      parts.push(`Nascimento/Óbito: ${nascimento} - ${obito}`);
    }

    if (pessoa.local) {
      parts.push(`Local: ${pessoa.local}`);
    }

    if (parts.length === 0) return null;

    const p = document.createElement('p');
    p.className = 'indice-meta';
    p.textContent = parts.join(' • ');
    return p;
  }

  function createLinksLine(pessoa) {
    const linksContainer = document.createElement('p');
    linksContainer.className = 'indice-links';

    let hasLinks = false;

    if (pessoa.links && pessoa.links.familysearch) {
      const fsLink = document.createElement('a');
      fsLink.href = pessoa.links.familysearch;
      fsLink.target = '_blank';
      fsLink.rel = 'noopener noreferrer';
      fsLink.textContent = 'FamilySearch';
      linksContainer.appendChild(fsLink);
      hasLinks = true;
    }

    if (pessoa.referencia_url) {
      if (hasLinks) {
        const separator = document.createTextNode(' • ');
        linksContainer.appendChild(separator);
      }

      const refLink = document.createElement('a');
      refLink.href = pessoa.referencia_url;
      refLink.textContent = 'Referência';
      linksContainer.appendChild(refLink);
      hasLinks = true;
    }

    return hasLinks ? linksContainer : null;
  }

  function renderResults(pessoas) {
    elements.listaResultados.textContent = '';

    elements.totalResultados.textContent = `${pessoas.length} resultado${pessoas.length === 1 ? '' : 's'}`;

    if (pessoas.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'indice-empty';
      empty.textContent = 'Nenhum resultado.';
      elements.listaResultados.appendChild(empty);
      return;
    }

    const list = document.createElement('ul');
    list.className = 'indice-list';

    pessoas.forEach((pessoa) => {
      const item = document.createElement('li');
      item.className = 'indice-item';

      const nome = document.createElement('h3');
      nome.className = 'indice-nome';
      nome.textContent = pessoa.nome || 'Sem nome';

      const id = document.createElement('p');
      id.className = 'indice-id';
      id.textContent = `ID: ${pessoa.id || 'N/D'}`;

      item.appendChild(nome);
      item.appendChild(id);

      const meta = createMetaLine(pessoa);
      if (meta) item.appendChild(meta);

      const links = createLinksLine(pessoa);
      if (links) item.appendChild(links);

      list.appendChild(item);
    });

    elements.listaResultados.appendChild(list);
  }

  function updateResults() {
    renderResults(filterPessoas());
  }

  function debounce(fn, delay) {
    let timeoutId;
    return function debounced(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  async function loadData() {
    try {
      elements.status.textContent = 'Carregando índice...';
      const response = await fetch(DATA_URL, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Erro ao carregar dados: ${response.status}`);
      }

      const data = await response.json();
      state.pessoas = Array.isArray(data) ? data : [];
      elements.status.textContent = '';
      updateResults();
    } catch (error) {
      elements.status.textContent = 'Não foi possível carregar o índice de pessoas.';
      elements.totalResultados.textContent = '0 resultados';
      elements.listaResultados.textContent = '';
      console.error(error);
    }
  }

  function bindEvents() {
    const onSearchInput = debounce((event) => {
      state.searchTerm = event.target.value;
      updateResults();
    }, SEARCH_DEBOUNCE_MS);

    elements.searchInput.addEventListener('input', onSearchInput);

    elements.apenasFalecidos.addEventListener('change', (event) => {
      state.apenasFalecidos = event.target.checked;
      updateResults();
    });
  }

  if (
    !elements.searchInput ||
    !elements.apenasFalecidos ||
    !elements.totalResultados ||
    !elements.listaResultados ||
    !elements.status
  ) {
    return;
  }

  bindEvents();
  loadData();
})();
