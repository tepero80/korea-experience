# 블로그 포스트 날짜 재분배 스크립트
$startDate = Get-Date "2026-01-01"
$endDate = Get-Date "2026-02-03"
$posts = Get-ChildItem -Path "content\posts" -Filter "*.md" | Sort-Object Name

$totalDays = ($endDate - $startDate).Days + 1
Write-Host "전체 포스트: $($posts.Count)개를 $totalDays 일에 분배"

$currentIndex = 0

for ($day = 0; $day -lt $totalDays; $day++) {
    $currentDate = $startDate.AddDays($day)
    $dateString = $currentDate.ToString("yyyy-MM-dd")
    
    $remainingPosts = $posts.Count - $currentIndex
    $remainingDays = $totalDays - $day
    $postsForToday = [math]::Ceiling($remainingPosts / $remainingDays)
    
    Write-Host "$dateString : $postsForToday 개"
    
    for ($i = 0; $i -lt $postsForToday -and $currentIndex -lt $posts.Count; $i++) {
        $post = $posts[$currentIndex]
        $content = Get-Content $post.FullName -Raw -Encoding UTF8
        $newContent = $content -replace 'date:\s*\d{4}-\d{2}-\d{2}', "date: $dateString"
        Set-Content -Path $post.FullName -Value $newContent -Encoding UTF8 -NoNewline
        $currentIndex++
    }
}

Write-Host "`n완료! $currentIndex 개 업데이트됨"
