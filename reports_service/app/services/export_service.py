import csv
import io
from fastapi.responses import StreamingResponse

def export_csv(data: list, filename: str) -> StreamingResponse:
    output = io.StringIO()
    if not data:
        output.write("No data found")
    else:
        writer = csv.DictWriter(output, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
