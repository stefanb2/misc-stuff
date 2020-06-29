package ComicsFetch::wumo;
use 5.030;
use strict;
use warnings;

sub get() {
    ::get_comic_gocomics('wumo');
}

1;
