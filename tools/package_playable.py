"""Package the allowlisted game and preserved editions for local play; never deploys."""
from pathlib import Path
import shutil,subprocess,zipfile,argparse
r=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--zip',type=Path,default=r/'THE_LAST_ARCHIVE_PLAYABLE.zip');a=p.parse_args()
subprocess.run(['python3',str(r/'tools/build_site.py')],cwd=r,check=True)
out=r/'.playable'
if out.exists():shutil.rmtree(out)
shutil.copytree(r/'dist',out);shutil.copy2(r/'tools/launch_game.py',out/'START_GAME.py')
(out/'START_WINDOWS.bat').write_text('@echo off\ncd /d "%~dp0"\npy -3 --version >nul 2>&1\nif %errorlevel% equ 0 (py -3 START_GAME.py & pause & exit /b)\npython --version >nul 2>&1\nif %errorlevel% equ 0 (python START_GAME.py & pause & exit /b)\necho Install free Python 3 from https://www.python.org/downloads/ and try again.\npause\n')
(out/'START_MAC.command').write_text('#!/bin/sh\ncd "$(dirname "$0")"\npython3 START_GAME.py\n')
(out/'START_MAC.command').chmod(0o755)
(out/'READ_ME_FIRST.txt').write_text('THE LAST ARCHIVE — INVESTIGATIVE FIELDWORK EDITION\n\nThis is a playable review build, not an approved release. No game has been deployed.\n\n1. Extract the entire ZIP into a folder. Do not run inside the ZIP.\n2. Windows: double-click START_WINDOWS.bat.\n   macOS: double-click START_MAC.command, or open Terminal in this folder and run python3 START_GAME.py.\n   Linux: run python3 START_GAME.py in this folder.\n3. The launcher opens http://127.0.0.1:8795/index.html. Keep its window open.\n\nPython 3 is a free local file server; the game itself uses only the browser and local files. If Python is absent, install it free from python.org/downloads/. No game packages, subscription or paid API are required. Do not open index.html directly as a file.\n\nStart the investigation normally. The new observation notebook and personal theory board are available as their sources are recovered. The expanded investigation appears naturally within the campaign. No special debug steps or developer answers are needed.\n\nSAVES\nThe fieldwork edition has its own save. Phase 1 and original saves are not erased. Use Sound / offline to export backups. A compatible Phase 1 backup can be imported as a copy. Local saves belong to the exact browser address and port; a different address needs an exported backup.\n\nPREVIOUS EDITIONS\nPhase 1: editions/phase1/index.html\nOriginal: editions/original/index.html\nOpen these URLs under the same server, or use the links in the game settings. Each earlier edition retains its own saves and requires its own explicit offline download.\n\nOFFLINE\nStart while the launcher is running, open Sound / offline and select Download this playable edition. Wait for Offline ready before relying on offline use. Earlier editions are preserved in the folder but are not part of the active edition download. Local storage remains subject to browser settings and eviction; export a backup.\n\nNo AI models, tests or private narrative documents are included. All player-facing content is English. The 60–90+ minute target has not been independently measured.\n')
readme=out/'READ_ME_FIRST.txt'
readme.write_text(readme.read_text().replace('SAVES\n','UPDATING AN EARLIER OFFLINE DOWNLOAD\nClose the earlier launcher before starting the updated folder at the same address. If this address still opens the earlier interface, keep the updated launcher running, open Sound / offline, select Download this playable edition, wait for Offline ready, then reload. This refreshes the verified files without clearing your save. The updated settings show FIELDWORK REVIEW 6. Export a backup before changing browser addresses.\n\nSAVES\n'))
try: revision=subprocess.run(['git','rev-parse','--short','HEAD'],cwd=r,capture_output=True,text=True,check=True).stdout.strip()
except (OSError,subprocess.CalledProcessError): revision='local review'
(out/'BUILD.txt').write_text('THE LAST ARCHIVE / FIELDWORK REVIEW 6\nCommit: '+revision+'\nNo merge or deployment. Earlier editions remain preserved.\n')
a.zip.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(a.zip,'w',zipfile.ZIP_DEFLATED,compresslevel=6)as z:
 for f in sorted(out.rglob('*')):
  if f.is_file():z.write(f,Path('THE_LAST_ARCHIVE')/f.relative_to(out))
print('Playable package:',a.zip,'bytes:',a.zip.stat().st_size)
