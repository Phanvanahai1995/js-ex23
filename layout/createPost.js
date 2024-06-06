export const createPostHtml = `<div class="verified">
<ul class="profile">
    <li>Chào bạn: <b><span class="name">Loading...</span></b></li>
    <li><a href="#" class="logout">Đăng xuất</a></li>
</ul>
<form class="post-article">
    <div class="form-group">
        <label for="title" class="label-form">Tiêu đề bài viết</label>
        <input id="title" name="title" placeholder="Nhập tiêu đề bài viết" required/>
    </div>
    <div class="form-group">
        <label for="content" class="label-form">Nhập nội dung bài viết</label>
        <textarea name="content" id="content" cols="30" rows="10" required></textarea>
    </div>
     <div class="form-group">
        <label for="content" class="label-form">Chọn thời gian đăng bài (Nếu có)</label>
        <input type="text" id="datetime-picker" placeholder="DD/MM/YY">
    </div>
    
    <button class="submit-article">Submit</button>
     <span class="time-remain"></span>
   
</form>
</div>`;
