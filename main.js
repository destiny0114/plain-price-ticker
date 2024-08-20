const coins = [
  "LINK/USDT",
  "BTC/USDT",
  "ETH/USDT",
  "STX/USDT",
  "BCH/USDT",
  "LTC/USDT",
  "AAVE/USDT",
  "ADA/USDT",
  "BNB/USDT",
  "SOL/USDT",
  "XRP/USDT",
  "DOT/USDT",
  "NEAR/USDT",
  "DOGE/USDT",
  "AVAX/USDT",
  "TRX/USDT",
  "SHIB/USDT",
  "ETC/USDT",
  "XLM/USDT",
  "WBTC/USDT",
  "WIF/USDT",
  "PEPE/USDT",
  "FIL/USDT",
  "ENS/USDT",
  "EOS/USDT",
  "GALA/USDT",
  "GRT/USDT",
  "ICP/USDT",
  "ALGO/USDT",
  "AXS/USDT",
  "JUP/USDT",
  "UNI/USDT",
  "OP/USDT",
  "RUNE/USDT",
  "SUI/USDT",
  "SEI/USDT",
  "HBAR/USDT",
  "VET/USDT",
  "MATIC/USDT",
  "ZEC/USDT",
  "SUSHI/USDT",
  "YFI/USDT",
  "SNX/USDT",
  "CHZ/USDT",
  "EGLD/USDT",
  "DCR/USDT",
  "OM/USDT",
  "WBETH/USDT",
  "COTI/USDT",
  "MTL/USDT",
  "APT/USDT",
  "FET/USDT",
  "RENDER/USDT",
  "ATOM/USDT",
  "TAO/USDT",
  "ARB/USDT",
  "IMX/USDT",
  "INJ/USDT",
  "FDUSD/USDT",
  "AR/USDT",
  "NOT/USDT",
  "JASMY/USDT",
  "FLOKI/USDT",
];

window.addEventListener("load", (event) => {
  document.querySelectorAll(".marquee__inner").forEach((el) => {
    initialize(el);
  });

  async function watchTickerLoop(exchange, symbols) {
    let loop = true;

    while (loop) {
      try {
        const data = await exchange.watchTickers(symbols);
        const [[symbol, ticker]] = Object.entries(data);
        updateTicker(
          document.querySelectorAll(`.marquee__item[data-symbol="${symbol}"]`),
          ticker,
          exchange,
        );
      } catch (e) {
        console.error(e);
        loop = false;
      }
    }
  }

  async function pollTickerInterval(exchange, symbols) {
    try {
      const data = await exchange.fetchTickers(symbols);

      Object.entries(data).forEach(([symbol, ticker]) => {
        updateTicker(
          document.querySelectorAll(`.marquee__item[data-symbol="${symbol}"]`),
          ticker,
          exchange,
        );
      });
    } catch (e) {
      console.error(e);
      loop = false;
    }
  }

  async function main() {
    const exchange = new ccxt.pro.binance();

    await pollTickerInterval(exchange, coins);
    setInterval(async () => await pollTickerInterval(exchange, coins), 60000);
    // await watchTickerLoop(exchange, coins);
    await exchange.close();
  }

  main();
});

function initialize(container) {
  Array.from(coins).forEach((symbol, index) => {
    let div = document.createElement("div");
    div.classList.add("marquee__item");
    div.setAttribute("data-symbol", symbol);

    let img = document.createElement("img");
    img.width = 32;
    img.height = 32;
    img.src = `/assets/img/${symbol.split("/")[0].toLowerCase()}.png`;
    img.alt = "symbol";

    let span = document.createElement("span");
    span.textContent = "CONNECTING...";

    let i = document.createElement("i");
    div.append(img, span, i);
    container.append(div);
  });

  const marqueeContent = Array.from(container.children);
  marqueeContent.forEach(function (item) {
    const clonedItem = item.cloneNode(true);
    // clonedItem.setAttribute("aria-hidden", true);
    container.appendChild(clonedItem);
  });
}

function updateTicker(coinsElement, ticker, exchange) {
  coinsElement.forEach((el) => {
    let symbol = ticker.symbol;

    let span = el.querySelector("span");
    span.textContent = `${symbol.split("/")[0]}: $ ${exchange.numberToString(ticker.close)}`;
    span.style.color =
      ticker.previousClose > ticker.close
        ? "green"
        : ticker.previousClose < ticker.close
          ? "red"
          : "grey";

    let i = el.querySelector("i");
    i.className =
      ticker.previousClose > ticker.close
        ? "ti ti-caret-up-filled"
        : ticker.previousClose < ticker.close
          ? "ti ti-caret-down-filled"
          : "";

    i.style.color =
      ticker.previousClose > ticker.close
        ? "green"
        : ticker.previousClose < ticker.close
          ? "red"
          : "grey";
  });
}
