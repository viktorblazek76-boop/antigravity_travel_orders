$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('c:\Users\vikbla\OneDrive - Konica Minolta IT Solutions Czech s.r.o\Dokumenty\Antigravity\specification.docx')
$text = $doc.Content.Text
$text | Set-Content -Path 'c:\Users\vikbla\OneDrive - Konica Minolta IT Solutions Czech s.r.o\Dokumenty\Antigravity\specification.txt'
$doc.Close()
$word.Quit()
