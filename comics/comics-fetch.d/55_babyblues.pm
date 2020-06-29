package ComicsFetch::babyblues;
use 5.030;
use strict;
use warnings;

sub get() {
    ::get_comic_kingfeatures('babyblues', 'BabyBlues', 'Baby_Blues');
}

1;
