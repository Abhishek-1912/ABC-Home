import { useState } from 'react'
import { X, Upload, FileSpreadsheet, CheckCircle, AlertTriangle, Download } from 'lucide-react'
import { bulkUploadProducts } from '../api/admin'

function BulkUploadModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  // Helper to generate & download sample Excel template format (.csv / .xlsx compatible format)
  function downloadSampleTemplate() {
    const headers = ['SKU', 'Name', 'Short Description', 'Category ID', 'Brand', 'MRP', 'Selling Price', 'Stock Quantity', 'Image URLs']
    const sampleRow = ['ABC-RGB-003', 'ABC Desk Lamp', 'Modern LED desk lamp', '1', 'ABC Home', '2999', '1999', '50', 'https://example.com/img1.jpg, https://example.com/img2.jpg']
    
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), sampleRow.join(',')].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'products_bulk_template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    setError('')
    setReport(null)

    try {
      const result = await bulkUploadProducts(file)
      setReport(result)
      if (result.errors?.length === 0) {
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 1500)
      } else {
        onSuccess() // Refresh table for partially successful rows
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="text-emerald-600" size={22} />
            <h2 className="text-xl font-semibold">Bulk Upload Products</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Upload an Excel (`.xlsx`) sheet. Make sure columns follow the required format: 
          <span className="font-mono text-gray-700"> SKU, Name, Description, Category ID, Brand, MRP, Price, Stock, Image URLs</span>.
        </p>

        {/* Download Template Action */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 p-2.5">
          <span className="text-xs text-gray-600 font-medium">Need the standard layout?</span>
          <button
            type="button"
            onClick={downloadSampleTemplate}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <Download size={14} />
            Download Template
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleUpload} className="mt-4 space-y-4">
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-4 text-center">
            <input
              type="file"
              id="excel-file-input"
              accept=".xlsx, .xls, .csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
            <label htmlFor="excel-file-input" className="cursor-pointer">
              <Upload className="mx-auto mb-1 text-gray-400" size={24} />
              <span className="text-xs font-medium text-indigo-600 hover:underline">
                {file ? file.name : 'Click to select Excel file'}
              </span>
            </label>
          </div>

          {report && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-600">
                <CheckCircle size={16} />
                <span>Uploaded {report.successCount} products successfully!</span>
              </div>

              {report.errors?.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center gap-1 font-semibold text-amber-600 mb-1">
                    <AlertTriangle size={14} />
                    <span>Row Errors ({report.errors.length}):</span>
                  </div>
                  <ul className="max-h-28 overflow-y-auto divide-y divide-gray-200 text-red-600">
                    {report.errors.map((err, idx) => (
                      <li key={idx} className="py-1">{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !file}
              className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-50"
            >
              {uploading ? 'Processing...' : 'Upload Excel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BulkUploadModal