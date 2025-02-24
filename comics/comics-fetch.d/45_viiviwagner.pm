package ComicsFetch::viiviwagner;
use 5.030;
use strict;
use warnings;

sub get() {
    ::get_comic_hs(
        'https://www.hs.fi/api/laneitems/39221/list/normal/291',
        'viiviwagner'
    );
}

1;
