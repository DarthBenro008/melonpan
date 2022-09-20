class Logger {
  static async log(data: string) {
    await Bun.write(Bun.stdout, `${data}\n`);
  }

  static logo() {
    const melonpan = `
███╗░░░███╗███████╗██╗░░░░░░█████╗░███╗░░██╗██████╗░░█████╗░███╗░░██╗
████╗░████║██╔════╝██║░░░░░██╔══██╗████╗░██║██╔══██╗██╔══██╗████╗░██║
██╔████╔██║█████╗░░██║░░░░░██║░░██║██╔██╗██║██████╔╝███████║██╔██╗██║
██║╚██╔╝██║██╔══╝░░██║░░░░░██║░░██║██║╚████║██╔═══╝░██╔══██║██║╚████║
██║░╚═╝░██║███████╗███████╗╚█████╔╝██║░╚███║██║░░░░░██║░░██║██║░╚███║
╚═╝░░░░░╚═╝╚══════╝╚══════╝░╚════╝░╚═╝░░╚══╝╚═╝░░░░░╚═╝░░╚═╝╚═╝░░╚══╝

---------------------------------------------------------------------
⚡️Blazing fast melonpan, up and running!
`;
    Logger.log(melonpan);
  }

  private colors = {
    Reset: "\x1b[0m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",

    FgBlack: "\x1b[30m",
  };

  private colorMapper = {
    GET: this.colors.BgGreen,
    POST: this.colors.BgYellow,
    DELETE: this.colors.BgRed,
    PUT: this.colors.BgBlue,
  };

  async routeLogger(req: Request) {
    const time = new Date();
    const url = new URL(req.url);
    const routeBuilder = `${time.toLocaleTimeString()} | ${
      this.colorMapper[req.method] || this.colors.BgCyan
    } ${req.method} ${this.colors.Reset} | ${url.pathname}`;
    Logger.log(routeBuilder);
  }
}
export default Logger;
