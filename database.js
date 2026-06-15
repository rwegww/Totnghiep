// Cơ sở dữ liệu tĩnh cho thiệp mời.
// Mở theo mẫu: index.html?id=khanh-giao&guest=khach-moi
// Có thể thêm khách mới trong mảng "guests", hoặc thêm người tốt nghiệp mới
// bằng cách copy một object và đổi id, tên, ảnh.

window.INVITATION_DATABASE = [
    {
        id: 'khanh-giao',
        graduateName: 'Vương Thiện Khánh Giao',
        degree: 'Tân cử nhân',
        mainPhoto: 'image/unnamed.jpg',
        mainPhotoPosition: 'center calc(26% + 60px)',
        quote: 'Sự hiện diện và những lời chúc tốt đẹp của bạn sẽ làm cho buổi lễ thêm phần ý nghĩa.',
        ceremony: {
            titleKicker: 'Lễ',
            title: 'Tốt Nghiệp',
            year: '2026',
            time: '15:30 - 16:30',
            day: 'Thứ Bảy',
            date: '20.06.2026'
        },
        school: {
            prefix: 'ĐẠI HỌC',
            name: 'NGUYỄN TẤT THÀNH',
            englishName: 'NGUYEN TAT THANH UNIVERSITY',
            logo: 'image/logo.jpg'
        },
        location: {
            label: 'Tại',
            name: 'ĐẠI HỌC NGUYỄN TẤT THÀNH',
            address: 'Cơ sở An Phú Đông, 331A - 331B Đỗ Mười, An Phú Đông, Quận 12, TP.HCM'
        },
        guests: [
            {
                id: 'khach-moi',
                name: 'Khách mời'
            },
            {
                id: 'dao-tuan-kiet',
                name: 'ĐÀO TUẤN KIỆT'
            },
            {
                id: 'nguyen-thu-ha',
                name: 'NGUYỄN THU HÀ'
            },
            {
                id: 'le-thi-xuan-binh',
                name: 'LÊ THỊ XUÂN BÌNH'
            }
        ],
        gallery: [
            'image/anhphu/z7940284529245_01e86e95538bb2b0e57f0e822d069a72.jpg',
            'image/anhphu/z7940284530085_4c5e22f417e9c9db213ad851f79c415f.jpg',
            'image/anhphu/z7940284538880_afe256e13b0c3fa4d6a52e6f3fe3b1ee.jpg',
            'image/anhphu/z7940284539274_9c65563f936dc3161264b46246a55b10.jpg',
            'image/anhphu/z7940284543139_651cb909e54422c7f4419b05fa9a830b.jpg'
        ]
    }
];
