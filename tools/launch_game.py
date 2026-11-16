"""Start the extracted static game with Python 3's standard library. No installation of game packages."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
import argparse, webbrowser, threading
p=argparse.ArgumentParser(description='Open The Last Archive locally. No account or paid service is needed.')
p.add_argument('--port',type=int,default=8795);p.add_argument('--no-browser',action='store_true');a=p.parse_args()
root=Path(__file__).resolve().parent
handler=partial(SimpleHTTPRequestHandler,directory=str(root))
try:server=ThreadingHTTPServer(('127.0.0.1',a.port),handler)
except OSError:
 print('The local port is already in use. Close an earlier launcher, or run: python3 START_GAME.py --port 8796')
 raise SystemExit(1)
url=f'http://127.0.0.1:{a.port}/index.html'
print('\nTHE LAST ARCHIVE\n'+url+'\nKeep this window open while playing. Press Ctrl+C to stop.\nProgress belongs to this exact browser address; export a save before changing it.\n')
if not a.no_browser:threading.Timer(.6,lambda:webbrowser.open(url)).start()
try:server.serve_forever()
except KeyboardInterrupt:print('\nGame server stopped. Your browser saves have not been removed.')
finally:server.server_close()
