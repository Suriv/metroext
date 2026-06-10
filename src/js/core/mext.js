/**
 * @author   iSuriv
 *
 * - dateJson
 * - LoadData
 * - Format
 */

$(document).ready(function () {
  // Helpers
  function getIconClass(connection) {
    var key = connection.trim().toUpperCase();
    if (key === 'ML') {
      return 'icon-line-ml';
    }
    if (key === 'RAMAL' || key === 'LR') {
      return 'icon-line-lr';
    }
    if (key.startsWith('L')) {
      var numStr = key.substring(1);
      var num = parseInt(numStr, 10);
      if (!isNaN(num)) {
        var padded = num < 10 ? '0' + num : '' + num;
        return 'icon-line-' + padded;
      }
    }
    return 'icon-line-' + key.toLowerCase();
  }

  function getLineTitle(lineKey) {
    if (lineKey === 'LR') {
      return 'Línea Ramal';
    }
    if (lineKey === 'ML') {
      return 'Metro Ligero';
    }
    if (lineKey.startsWith('L')) {
      var numStr = lineKey.substring(1);
      var num = parseInt(numStr, 10);
      if (!isNaN(num)) {
        return 'Línea ' + num;
      }
    }
    return lineKey;
  }

  function renderLineCard(sections, lineKey) {
    var $lineCard = $('.line-card');
    $lineCard.empty();

    if (!sections) return;

    sections.forEach(function (section) {
      var $li = $('<li class="line-card--item"></li>');
      $li.append($('<h2 class="line-card__header"></h2>').text(section.seccion));

      section.contactos.forEach(function (contacto) {
        var $p = $('<p class="line-card__info"></p>');
        var showName = true;
        var nameLower = contacto.nombre ? contacto.nombre.trim().toLowerCase() : '';
        var lineKeyLower = lineKey.toLowerCase();

        // Omit names that are redundant (e.g. equal to lineKey or containing "linea" / "línea")
        if (!contacto.nombre ||
          nameLower === lineKeyLower ||
          nameLower.indexOf('linea') === 0 ||
          nameLower.indexOf('línea') === 0 ||
          nameLower.indexOf('ramal') !== -1) {
          showName = false;
        }

        if (showName) {
          $p.append($('<span class="line-card__info--name"></span>').text(contacto.nombre + ': '));
        }
        $p.append($('<span class="line-card__info--tel"></span>').text(contacto.telefono));
        $li.append($p);
      });

      $lineCard.append($li);
    });
  }

  function renderStationsList(stations) {
    var $container = $('.stations__container');
    $container.empty();

    if (!stations) return;

    stations.forEach(function (estacion) {
      var hasConnections = estacion.conexiones && estacion.conexiones.length > 0;
      var $li = $('<li class="stations__item"></li>');
      if (hasConnections) {
        $li.addClass('connect');
      }

      var $details = $('<details class="station-card"></details>');
      var $summary = $('<summary class="station-card__header"></summary>');
      $summary.append($('<h3 class="station-card__header--title"></h3>').text(estacion.nombre));

      if (hasConnections) {
        var $connectSpan = $('<span class="station-card__header--connect"></span>');
        estacion.conexiones.forEach(function (conn) {
          $connectSpan.append($('<span></span>').addClass(getIconClass(conn)));
        });
        $summary.append($connectSpan);
      }

      var $content = $('<div class="station-card__content"></div>');
      $content.append($('<p class="station-card__content--item"></p>').text(estacion.codigo));

      $details.append($summary).append($content);
      $li.append($details);
      $container.append($li);
    });
  }

  function loadLineData() {
    var hash = window.location.hash || '#l1';
    var lineKey = hash.substring(1).toUpperCase(); // 'L1', 'L2', etc.

    // 1. Update the article class (e.g. lines-stations l1)
    var $article = $('article.lines-stations');
    $article.attr('class', 'lines-stations ' + lineKey.toLowerCase());

    // 2. Update the header icon and title
    var $headerSpan = $('.lines-stations__header--line span');
    $headerSpan.attr('class', getIconClass(lineKey));

    var lineTitle = getLineTitle(lineKey);
    $('.lines-stations__header--line h1').text(lineTitle);

    // 3. Fetch data dynamically
    $.when(
      $.getJSON('assets/json/bd_lineas.json'),
      $.getJSON('assets/json/bd_estaciones.json')
    ).done(function (resLineas, resEstaciones) {
      var bdLineas = resLineas[0];
      var bdEstaciones = resEstaciones[0];

      renderLineCard(bdLineas[lineKey], lineKey);
      renderStationsList(bdEstaciones[lineKey]);
    }).fail(function (err) {
      console.error("Error loading JSON files", err);
    });
  }

  // Initial load
  loadLineData();

  // Load when hash changes
  $(window).on('hashchange', function () {
    loadLineData();
  });
});
