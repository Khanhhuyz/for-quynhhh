"""Local preview with byte ranges for reliable audio seeking."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def send_head(self):
        self.byte_range = None
        path = Path(self.translate_path(self.path))
        value = self.headers.get('Range', '')
        match = re.fullmatch(r'bytes=(\d+)-(\d*)', value)
        if not match or not path.is_file():
            return super().send_head()
        size = path.stat().st_size
        start = int(match[1])
        end = min(int(match[2]) if match[2] else size - 1, size - 1)
        if start > end:
            self.send_response(416)
            self.send_header('Content-Range', f'bytes */{size}')
            self.send_header('Content-Length', '0')
            self.end_headers()
            return None
        handle = path.open('rb')
        handle.seek(start)
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(str(path)))
        self.send_header('Content-Length', str(end - start + 1))
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.end_headers()
        self.byte_range = (start, end)
        return handle

    def copyfile(self, source, outputfile):
        if self.byte_range is None:
            return super().copyfile(source, outputfile)
        remaining = self.byte_range[1] - self.byte_range[0] + 1
        try:
            while remaining:
                block = source.read(min(65536, remaining))
                if not block:
                    break
                outputfile.write(block)
                remaining -= len(block)
        except (BrokenPipeError, ConnectionResetError):
            pass


if __name__ == '__main__':
    from functools import partial
    handler = partial(Handler, directory=str(Path(__file__).resolve().parent))
    print('Local: http://127.0.0.1:4173', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 4173), handler).serve_forever()
